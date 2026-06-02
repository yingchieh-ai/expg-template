#!/usr/bin/env bash
set -euo pipefail

PREV_IMAGE="${1:?Usage: ./scripts/rollback.sh <previous-image-tag>}"
sed -i "s|^APP_IMAGE=.*|APP_IMAGE=${PREV_IMAGE}|" .env
source .env

if [[ "${LOCAL_DB:-false}" == "true" ]]; then
  docker compose -f docker-compose.db.yml -f docker-compose.yml up -d --remove-orphans
else
  docker compose up -d --remove-orphans
fi
