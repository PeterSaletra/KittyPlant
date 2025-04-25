package mqtt

import (
	"context"
	"log"
	"sync"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/redis/go-redis/v9"
)

type MqttClient struct {
	client mqtt.Client
	redis  *redis.Client
	mu     sync.Mutex
}

func NewMqttClient(broker string, redisAddr string) *MqttClient {
	opts := mqtt.NewClientOptions().AddBroker(broker).SetClientID("kittyplant_mqtt_client")
	opts.SetDefaultPublishHandler(func(c mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message on topic %s: %s", msg.Topic(), string(msg.Payload()))
	})

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	return &MqttClient{
		client: client,
		redis:  redisClient,
	}
}

func (m *MqttClient) Subscribe(topic string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	token := m.client.Subscribe(topic, 1, func(client mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message on topic %s: %s", msg.Topic(), string(msg.Payload()))

		// Save the message to Redis
		ctx := context.Background()
		err := m.redis.Set(ctx, msg.Topic(), string(msg.Payload()), 0).Err()
		if err != nil {
			log.Printf("Failed to save message to Redis: %v", err)
		}
	})
	token.Wait()
	if token.Error() != nil {
		log.Printf("Failed to subscribe to topic %s: %v", topic, token.Error())
	}
}

// Disconnect disconnects the MQTT client.
func (m *MqttClient) Disconnect() {
	m.client.Disconnect(250)
}
