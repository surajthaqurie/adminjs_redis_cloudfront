#!/bin/bash

echo "---------------Create Admin----------"
echo ""

MAC_OS="darwin-amd64"
LINUX_OS="linux-amd64"
ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m |sed 's/x86_64/amd64/g')" |sed 's/darwin-arm64/darwin-amd64/g')

read -p "Enter admin email: " ADMIN_EMAIL
read -p "Enter admim password: " ADMIN_PASSWORD

if [ "$ARCH" = "$MAC_OS" ];then
sed -i "" "s/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/" ./.env
sed -i "" "s/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/" ./.env
else
sed -i "s/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/" ./.env
sed -i "s/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/" ./.env
fi

echo ""

node ./db-migrations/default-admin.data.js
sleep 5

if [ "$ARCH" = "$MAC_OS" ];then
sed -i "" "s/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/" ./.env
sed -i "" "s/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/" ./.env
else
sed -i "s/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/" ./.env
sed -i "s/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/" ./.env
fi