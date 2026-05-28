#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:?Usage: ./scripts/deploy.sh <version-tag>  e.g. v0.2.0}"
source .env
IMAGE="${APP_IMAGE%%:*}:${VERSION}"
sed -i "s|^APP_IMAGE=.*|APP_IMAGE=${IMAGE}|" .env
docker pull "${IMAGE}"

if [[ "${LOCAL_DB:-false}" == "true" ]]; then
  docker compose -f docker-compose.db.yml -f docker-compose.yml up -d --remove-orphans
else
  docker compose up -d --remove-orphans
fi
