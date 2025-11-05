package mqtt

import (
	"encoding/json"
	"kittyplant-api/cache"
	"kittyplant-api/config"
	"log"
	"sync"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MqttClient struct {
	client mqtt.Client
	cache  *cache.Cache
	mu     sync.Map
}

type SensorData struct {
	DeviceID   string  `json:"device_id"`
	Moisture   float64 `json:"moisture"`
	WaterLevel int64   `json:"water_level"`
	RelayState bool    `json:"relay_actived"`
}

func NewMqttClient(broker string, cache *cache.Cache) (*MqttClient, error) {
	log.Printf("Connecting to MQTT broker at %s", broker)
	opts := mqtt.NewClientOptions().
		AddBroker(broker).
		SetClientID("kittyplant_mqtt_client").
		SetUsername(config.AppConfig.BrokerUser).
		SetPassword(config.AppConfig.BrokerPassword)
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
		cache:  cache,
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

		var sensorData SensorData
		err := json.Unmarshal(msg.Payload(), &sensorData)
		if err != nil {
			log.Printf("Failed to unmarshal message payload: %v", err)
			return
		}

		err = m.cache.SetObject(msg.Topic(), sensorData, 0)
		if err != nil {
			log.Printf("Failed to save message to cache: %v", err)
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
