import paho.mqtt.client as mqtt
import time
import json
import random

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("Connected to MQTT broker")
        client.subscribe("kp-0001/data")  # Subscribe to the topic
        client.subscribe("kp-0001/commands")  # Subscribe to commands topic
    else:
        print("Could not connect, return code:", return_code)
        client.failed_connect = True


def on_message(client, userdata, message):
    topic = message.topic
    payload = str(message.payload.decode("utf-8"))
    
    if topic.endswith("/commands"):
        print(f"Received command on {topic}: {payload}")
        try:
            command_data = json.loads(payload)
            command = command_data.get("command")
            
            # Handle different commands
            if command == "water":
                print("Command: Water the plant!")
                # Trigger the relay/pump to water the plant
                # In real device, this would activate the water pump
            elif command == "restart":
                print("Command: Restart the device!")
                # Restart the device/microcontroller
                # In real device, this would trigger ESP32 restart
            elif command == "find":
                print("Command: Find device (blink LED or beep)!")
                # Activate LED blinking or buzzer to locate the device
                # In real device, this would make LED blink or play a sound
            elif command == "status":
                print("Command: Send status update")
                # Send a status update
            else:
                print(f"Unknown command: {command}")
        except json.JSONDecodeError:
            print(f"Invalid JSON in command: {payload}")
    else:
        print(f"Received message on {topic}: {payload}")


def on_log(client, userdata, level, buf):
    print(f"LOG: {buf}")


broker_hostname = "localhost"  # Use the MQTT broker's hostname or IP
port = 1883  # Standard MQTT port for TCP connections

client = mqtt.Client(client_id="Kitty")  # Create a new MQTT client instance
client.username_pw_set(username="kitty_mqtt", password="password")  # Set username and password if required
client.on_connect = on_connect
client.on_message = on_message
client.on_log = on_log  # Attach the logging callback
client.failed_connect = False

try:
    print(f"Connecting to broker at tcp://{broker_hostname}:{port}")
    client.connect(host=broker_hostname, port=port)  # Connect to the broker over TCP
    client.loop_start()

    # Simulate sensor data
    relay_state = False
    
    while not client.failed_connect:
        time.sleep(5)  # Send data every 5 seconds
        
        # Simulate varying sensor readings
        moisture_level = random.randint(40, 60)
        water_level = random.randint(55, 75)
        
        # Randomly toggle relay state (10% chance)
        if random.random() < 0.1:
            relay_state = not relay_state
        
        # Create sensor data payload
        sensor_data = {
            "device_id": "kp-0001",
            "moisture_level": moisture_level,
            "water_level": water_level,
            "relay_actived": relay_state
        }
        
        # Convert to JSON
        payload = json.dumps(sensor_data)
        
        # Publish to device topic
        client.publish("kp-0001/data", payload)
        print(f"Published: {payload}")
        
        if client.failed_connect:
            break

finally:
    client.disconnect()
    client.loop_stop()
    print("Disconnected from MQTT broker")