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
	mu     sync.Map
}

func NewMqttClient(broker string, redisClient *redis.Client) (*MqttClient, error) {
	log.Printf("Connecting to MQTT broker at %s", broker)
	opts := mqtt.NewClientOptions().
		AddBroker(broker).
		SetClientID("kittyplant_mqtt_client").
		SetUsername("kitty_mqtt").
		SetPassword("password")
	opts.SetDefaultPublishHandler(func(c mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message on topic %s: %s", msg.Topic(), string(msg.Payload()))
	})
	opts.OnConnect = func(c mqtt.Client) {
		log.Println("Connected to MQTT broker")
	}
	opts.OnConnectionLost = func(c mqtt.Client, err error) {
		log.Printf("Connection lost: %v", err)
	}
	opts.OnReconnecting = func(c mqtt.Client, options *mqtt.ClientOptions) {
		log.Println("Reconnecting to MQTT broker")
	}

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Printf("Failed to connect to MQTT broker: %v", token.Error())
		return nil, token.Error()
	}

	return &MqttClient{
		client: client,
		redis:  redisClient,
	}, nil
}

func (m *MqttClient) Subscribe(topic string) {
	_, loaded := m.mu.LoadOrStore(topic, true)
	if loaded {
		log.Printf("Already subscribed to topic %s", topic)
		return
	}
	log.Printf("Subscribing to topic %s", topic)
	token := m.client.Subscribe(topic, 0, func(client mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message on topic %s: %s", msg.Topic(), string(msg.Payload()))

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

func (m *MqttClient) Disconnect() {
	m.client.Disconnect(250)
}
