#!/bin/sh

if [ ! -f /app/avatars/default.png ]; then
    cp /avatars /app/avatars
fi

node src/server.js