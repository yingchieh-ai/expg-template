#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:?Usage: ./scripts/build.sh <version-tag>  e.g. v0.2.0}"
source .env
IMAGE="${APP_IMAGE%%:*}:${VERSION}"
docker build -t "${IMAGE}" .
echo "To push: docker push ${IMAGE}"
