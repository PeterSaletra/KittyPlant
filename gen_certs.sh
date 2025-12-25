#!/bin/bash 

# Create directory for certificates
mkdir -p conf/mosquitto/certs
cd conf/mosquitto/certs

echo "=== Generating Certificate Authority (CA) ==="
openssl req -new -x509 -days 3650 -extensions v3_ca \
  -keyout ca.key -out ca.crt \
  -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=CA/CN=KittyPlant CA"

echo ""
echo "=== Generating Mosquitto Server Certificate ==="
# Generate server key
openssl genrsa -out server.key 2048

# Generate server CSR
openssl req -new -key server.key -out server.csr \
  -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=Server/CN=broker"

# Sign server certificate with CA
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out server.crt -days 3650

echo ""
echo "=== Generating Backend Client Certificate ==="
# Generate backend client key
openssl genrsa -out client.key 2048

# Generate backend client CSR
openssl req -new -key client.key -out client.csr \
  -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=Client/CN=kp-backend"

# Sign backend client certificate with CA
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out client.crt -days 3650

echo ""
echo "=== Generating ESP32 Device Certificates ==="
# Generate certificate for each device
DEVICE_ID="kp-0001"

openssl genrsa -out ${DEVICE_ID}.key 2048

openssl req -new -key ${DEVICE_ID}.key -out ${DEVICE_ID}.csr \
  -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=Device/CN=${DEVICE_ID}"

openssl x509 -req -in ${DEVICE_ID}.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out ${DEVICE_ID}.crt -days 3650

echo ""
echo "=== Cleaning up CSR files ==="
rm -f *.csr

echo ""
echo "=== Setting proper permissions ==="
chmod 600 *.key
chmod 644 *.crt

cd ../../..

echo ""
echo "=== Certificate Generation Complete ==="
echo "Generated files:"
echo "  - ca.crt, ca.key (Certificate Authority)"
echo "  - server.crt, server.key (Mosquitto broker)"
echo "  - client.crt, client.key (Backend API)"
echo "  - ${DEVICE_ID}.crt, ${DEVICE_ID}.key (ESP32 device)"
echo ""
echo "Copy device certificates to ESP32 SPIFFS:"
echo "  - conf/mosquitto/certs/ca.crt -> /ca.crt"
echo "  - conf/mosquitto/certs/${DEVICE_ID}.crt -> /client.crt"
echo "  - conf/mosquitto/certs/${DEVICE_ID}.key -> /client.key"