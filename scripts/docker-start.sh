#!/bin/sh
# Start kontejnera: migracije → seed (samo prazna baza) → server.
# `exec` predaje PID 1 Node-u, pa SIGTERM iz Docker-a stiže do servera (uredno gašenje).
set -e

node /opt/prisma/node_modules/prisma/build/index.js migrate deploy --schema=prisma/schema.prisma
node dist/seed.cjs --if-empty

exec node server.js
