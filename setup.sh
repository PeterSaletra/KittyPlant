#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

die() {
  printf '%s\n' "$*" >&2
  exit 1
}

usage() {
  printf '%s\n' \
    'Usage: bash setup.sh [--host HOST] [--reset]' \
    '  --host HOST  DNS name or IPv4 address used to open KittyPlant.' \
    '  --reset      Remove this Compose project’s data volumes and generate a new .env.'
}

host=
reset=false
while (( $# )); do
  case $1 in
    --host)
      (( $# >= 2 )) || die "Missing value for --host."
      host=$2
      shift
      ;;
    --reset) reset=true ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; die "Unknown argument: $1" ;;
  esac
  shift
done

cd -- "$(dirname -- "$0")"
repo=$PWD

for command in docker openssl curl flock; do
  command -v "$command" >/dev/null || die "Install $command before running setup."
done
docker info --format '{{.ServerVersion}}' >/dev/null
compose_help=$(docker compose up --help)
[[ $compose_help == *--wait-timeout* ]] || die "Update Docker Compose to use --wait-timeout."

mkdir -p .data
exec 9>.data/setup.lock
flock -n 9 || die "Another setup is already running in this checkout."

if [[ -e .data/tls ]]; then
  [[ -f .data/tls/web-host ]] || die "Incomplete TLS directory at .data/tls. Move it aside and rerun setup."
  read -r configured_host < .data/tls/web-host
  [[ -z $host || $host == "$configured_host" ]] ||
    die "This checkout already has TLS certificates for $configured_host. Use that host."
  host=$configured_host
fi
host=${host:-$(hostname)}
[[ $host =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]] || die "Use a DNS name or IPv4 address for --host."

if $reset; then
  printf '\nThis removes the Compose project volumes for PostgreSQL, Redis, and Mosquitto.\n'
  read -r -p 'Type RESET to continue: ' confirmation || die "Reset cancelled."
  [[ $confirmation == RESET ]] || die "Reset cancelled."
fi

tls_stage=
env_stage=
cleanup() {
  if [[ -n $tls_stage ]]; then rm -rf -- "$tls_stage"; fi
  if [[ -n $env_stage ]]; then rm -f -- "$env_stage"; fi
}
trap cleanup EXIT

create_ca() {
  local name=$1
  openssl genrsa -out "$tls_stage/ca/$name.key" 2048
  openssl req -x509 -key "$tls_stage/ca/$name.key" -days 3650 \
    -subj "/CN=KittyPlant $name CA" \
    -addext 'basicConstraints=critical,CA:TRUE,pathlen:0' \
    -addext 'keyUsage=critical,keyCertSign,cRLSign' \
    -out "$tls_stage/ca/$name.crt"
}

issue_certificate() {
  local ca=$1 directory=$2 file=$3 identity=$4 purpose=$5 san=${6:-}
  local output="$tls_stage/$directory/$file"
  mkdir -m 755 -p "$tls_stage/$directory"
  openssl genrsa -out "$output.key" 2048
  openssl req -new -key "$output.key" -subj "/CN=$identity" -out "$tls_stage/request.csr"
  printf 'basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=%s\n' \
    "$purpose" > "$tls_stage/extensions"
  if [[ -n $san ]]; then printf 'subjectAltName=%s\n' "$san" >> "$tls_stage/extensions"; fi
  openssl x509 -req -in "$tls_stage/request.csr" -days 825 \
    -CA "$tls_stage/ca/$ca.crt" -CAkey "$tls_stage/ca/$ca.key" \
    -extfile "$tls_stage/extensions" -out "$output.crt"
}

if [[ ! -e .data/tls ]]; then
  printf 'Generating TLS certificates for %s...\n' "$host"
  tls_stage=$(mktemp -d "$repo/.data/tls.XXXXXX")
  mkdir "$tls_stage/ca"
  for ca in web db redis mqtt; do create_ca "$ca"; done

  if [[ $host =~ ^[0-9.]+$ ]]; then host_san="IP:$host"; else host_san="DNS:$host"; fi
  issue_certificate web web nginx 'KittyPlant Web' serverAuth "DNS:localhost,IP:127.0.0.1,$host_san"
  issue_certificate db postgres server postgres serverAuth DNS:postgres
  issue_certificate redis redis server redis serverAuth DNS:redis
  issue_certificate redis redis-client client kp-redis clientAuth
  issue_certificate mqtt mqtt server broker serverAuth "DNS:broker,$host_san"
  issue_certificate mqtt mqtt-client client kp-backend clientAuth
  issue_certificate mqtt esp32 kp-0001 kp-0001 clientAuth

  cp "$tls_stage/ca/db.crt" "$tls_stage/db-ca.crt"
  cp "$tls_stage/ca/web.crt" "$tls_stage/web-ca.crt"
  for directory in redis redis-client; do
    cp "$tls_stage/ca/redis.crt" "$tls_stage/$directory/ca.crt"
  done
  for directory in mqtt mqtt-client esp32; do
    cp "$tls_stage/ca/mqtt.crt" "$tls_stage/$directory/ca.crt"
  done
  chmod 644 "$tls_stage"/*/*.crt "$tls_stage"/*.crt
  printf '%s\n' "$host" > "$tls_stage/web-host"
  rm -- "$tls_stage/request.csr" "$tls_stage/extensions"
  mv -T -- "$tls_stage" .data/tls
  tls_stage=
fi

# Compose gives exported variables precedence over the project's .env.
unset DB_USER DB_NAME DB_PASS JWT_SECRET REDIS_PASSWORD
env_file=.env
if [[ ! -f .env ]] || $reset; then
  env_stage=$(mktemp "$repo/.data/env.XXXXXX")
  db_pass=$(openssl rand -hex 32)
  redis_pass=$(openssl rand -hex 32)
  jwt_secret=$(openssl rand -hex 32)
  cat > "$env_stage" <<EOF
DB_USER=kittyplant
DB_NAME=kittyplant
DB_PASS=$db_pass
REDIS_PASSWORD=$redis_pass
JWT_SECRET=$jwt_secret
EOF
  env_file=$env_stage
fi
compose=(docker compose --env-file "$env_file" -f docker-compose.yaml)
"${compose[@]}" config --quiet

printf 'Building the backend and frontend...\n'
"${compose[@]}" build

set_key_owner() {
  local service=$1 account=$2 directory=$3
  "${compose[@]}" run --rm --no-deps -T --interactive=false --user 0 --entrypoint sh \
    --volume "$repo/.data/tls/$directory:/setup-certs:rw" "$service" \
    -ec 'chown "$1" /setup-certs/server.key; chmod 600 /setup-certs/server.key' sh "$account"
}
set_key_owner postgres postgres postgres
set_key_owner redis redis redis
set_key_owner broker mosquitto mqtt

if $reset; then
  if [[ -f .env ]]; then
    backup=$(mktemp "$repo/.data/env.backup.XXXXXX")
    cp -- .env "$backup"
    printf 'Previous .env saved to %s\n' "$backup"
  fi
  "${compose[@]}" down --volumes
fi
if [[ -n $env_stage ]]; then
  mv -T -- "$env_stage" .env
  env_stage=
fi

compose=(docker compose --env-file .env -f docker-compose.yaml)
printf 'Starting KittyPlant and waiting for health checks...\n'
if ! "${compose[@]}" up -d --wait --wait-timeout 180; then
  "${compose[@]}" ps -a
  "${compose[@]}" logs --tail=25 postgres redis broker backend nginx
  die "KittyPlant did not become ready."
fi

request=(curl --fail --silent --show-error --noproxy '*' --max-time 10 --retry 5 --retry-connrefused
  --cacert .data/tls/web-ca.crt)
"${request[@]}" https://127.0.0.1/ -o /dev/null
health=$("${request[@]}" https://127.0.0.1/api/healthcheck)
[[ $health == '{"status":"ok"}' ]] || die "Unexpected API health response: $health"

printf '\nKittyPlant is ready at https://%s\n' "$host"
printf 'Browser trust certificate: %s/.data/tls/web-ca.crt\n' "$repo"
