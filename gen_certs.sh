# Utwórz katalog na certyfikaty
mkdir -p conf/mosquitto/certs
cd conf/mosquitto/certs

# Wygeneruj CA (Certificate Authority)
openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=CA/CN=KittyPlant CA"

# Wygeneruj klucz serwera
openssl genrsa -out server.key 2048

# Wygeneruj Certificate Signing Request (CSR)
openssl req -new -key server.key -out server.csr -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=Server/CN=broker"

# Podpisz certyfikat serwera za pomocą CA
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365

# Opcjonalnie: Wygeneruj certyfikaty klienta (dla ESP32)
openssl genrsa -out client.key 2048
openssl req -new -key client.key -out client.csr -subj "/C=PL/ST=Poland/L=City/O=KittyPlant/OU=Client/CN=esp32-client"
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365

# Usuń CSR (nie są już potrzebne)
rm server.csr client.csr

cd ../../..

# CA (raz)
openssl req -new -x509 -days 3650 -keyout ca.key -out ca.crt \
  -subj "/CN=KittyPlant CA/O=HomeAutomation"

# Dla każdego ESP32
DEVICE_ID="kittyplant-001"
openssl genrsa -out ${DEVICE_ID}.key 2048
openssl req -new -key ${DEVICE_ID}.key -out ${DEVICE_ID}.csr \
  -subj "/CN=${DEVICE_ID}/O=sensors"
openssl x509 -req -in ${DEVICE_ID}.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out ${DEVICE_ID}.crt -days 3650