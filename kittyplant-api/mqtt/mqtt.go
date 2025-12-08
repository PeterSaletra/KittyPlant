package mqtt

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"kittyplant-api/cache"
	"log"
	"os"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MqttClient struct {
	client mqtt.Client
	cache  *cache.Cache
	mu     sync.Map
}

type SensorData struct {
	DeviceID       string    `json:"device_id"`
	Moisture       float64   `json:"moisture"`
	WaterLevel     int64     `json:"water_level"`
	RelayState     bool      `json:"relay_actived"`
	LastWatered    time.Time `json:"last_watered,omitempty"`
	LastWateredStr string    `json:"last_watered_str,omitempty"`
}

func NewMqttClient(broker string, cache *cache.Cache) (*MqttClient, error) {
	log.Printf("Connecting to MQTT broker at %s", broker)
	opts := mqtt.NewClientOptions().
		AddBroker(broker).
		SetClientID("kittyplant_mqtt_client")

	tlsConfig := &tls.Config{
		InsecureSkipVerify: false,
	}

	if caCert, err := os.ReadFile("conf/mosquitto/certs/ca.crt"); err == nil {
		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)
		tlsConfig.RootCAs = caCertPool
	}

	opts.SetTLSConfig(tlsConfig)

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
		currentTime := time.Now()
		log.Printf("At time: %s", currentTime.Format(time.RFC3339))

		var sensorData SensorData
		err := json.Unmarshal(msg.Payload(), &sensorData)
		if err != nil {
			log.Printf("Failed to unmarshal message payload: %v", err)
			return
		}

		// Try to get previous data to check for relay state change
		previousDataRaw, err := m.cache.GetObjectAll(msg.Topic())
		if err == nil && previousDataRaw != nil {
			// Convert map to previous sensor data
			if dataMap, ok := previousDataRaw.(map[string]interface{}); ok {
				prevRelayState, _ := dataMap["relay_actived"].(string)
				prevLastWatered, _ := dataMap["last_watered_str"].(string)

				// If relay changed from inactive to active, record watering time
				if prevRelayState == "false" && sensorData.RelayState {
					sensorData.LastWatered = currentTime
					sensorData.LastWateredStr = currentTime.Format(time.RFC3339)
					log.Printf("Watering detected for device %s at %s", sensorData.DeviceID, sensorData.LastWateredStr)
				} else if prevLastWatered != "" {
					// Keep the previous last watered time
					sensorData.LastWateredStr = prevLastWatered
					parsedTime, parseErr := time.Parse(time.RFC3339, prevLastWatered)
					if parseErr == nil {
						sensorData.LastWatered = parsedTime
					}
				}
			}
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
