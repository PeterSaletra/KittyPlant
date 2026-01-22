#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Generating certificates for PostgreSQL and Redis...${NC}"

# Create directories
mkdir -p certs/postgres certs/redis

# Generate CA key and certificate
echo -e "${YELLOW}Generating CA certificate...${NC}"
openssl genrsa -out certs/ca.key 4096
openssl req -new -x509 -days 3650 -key certs/ca.key -out certs/ca.crt \
    -subj "/C=PL/ST=State/L=City/O=KittyPlant/CN=KittyPlant-CA"

# Generate PostgreSQL certificates
echo -e "${YELLOW}Generating PostgreSQL certificates...${NC}"
openssl genrsa -out certs/postgres/server.key 4096
openssl req -new -key certs/postgres/server.key -out certs/postgres/server.csr \
    -subj "/C=PL/ST=State/L=City/O=KittyPlant/CN=postgres"
openssl x509 -req -days 3650 -in certs/postgres/server.csr \
    -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial \
    -out certs/postgres/server.crt

# Set correct permissions for PostgreSQL
chmod 600 certs/postgres/server.key
cp certs/ca.crt certs/postgres/ca.crt

# Generate Redis certificates
echo -e "${YELLOW}Generating Redis certificates...${NC}"
openssl genrsa -out certs/redis/server.key 4096
openssl req -new -key certs/redis/server.key -out certs/redis/server.csr \
    -subj "/C=PL/ST=State/L=City/O=KittyPlant/CN=redis"
openssl x509 -req -days 3650 -in certs/redis/server.csr \
    -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial \
    -out certs/redis/server.crt

# Copy CA certificate to Redis directory
cp certs/ca.crt certs/redis/ca.crt

# Clean up CSR files
rm certs/postgres/server.csr certs/redis/server.csr

echo -e "${GREEN}Certificates generated successfully!${NC}"
echo -e "${YELLOW}PostgreSQL certificates: certs/postgres/${NC}"
echo -e "${YELLOW}Redis certificates: certs/redis/${NC}"
