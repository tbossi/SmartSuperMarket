#!/usr/bin/env bash
set -e
function alert {
	echo
	echo $1
	echo "----------------------------------------"
	echo
}

# assuming default mode is non-root user
ASUSER="eval"
ASROOT="sudo"

# Variables
APP_NAME="smart_supermarket"
SRC_DIR="src"
HTTP_PORT=3000
TCP_PORT=9090
FLOW_FILE="./node-red/smart_supermarket-flows.json"
DATASET_FILE="./dataset/smart_supermarket-dataset.json"

if ! hash dockerd 2>/dev/null; then
	$ASUSER echo "It seems Docker is not yet installed. Fixing..."

	$ASUSER alert "Downloading Docker (this can take some time...)"
	$ASROOT mkdir temp
	$ASROOT cd temp
	$ASROOT wget https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
	$ASROOT tar xzvf docker-17.04.0-ce.tgz

	$ASUSER alert "Installing Docker"
	$ASROOT cp -r docker/* /usr/bin/
	$ASROOT chmod -R 755 /usr/bin/docker*

	$ASUSER echo "Cleaning up"
	$ASUSER echo
	$ASROOT cd ..
	$ASROOT rm -rf temp
else
	$ASUSER echo "Docker is already installed"
fi


if ! pgrep -x "dockerd" > /dev/null; then
	$ASUSER echo "Starting dockerd daemon"
	$ASROOT dockerd &
else
	$ASUSER echo "dockerd already running"
fi


$ASUSER alert "Building container \(this can take some time...\)"
$ASUSER cd $SRC_DIR
$ASROOT docker build -t $APP_NAME .
$ASUSER cd ..

$ASUSER alert "Inserting dataset in mongodb"
$ASROOT mongo $APP_NAME --eval "db.dropDatabase()"
$ASROOT mongoimport --jsonArray --db $APP_NAME --collection products --file $DATASET_FILE

$ASUSER alert "Starting node-red"
$ASROOT node-red $FLOW_FILE > node-red.log 2>&1 &

$ASUSER alert "Starting $APP_NAME"
$ASROOT docker run --name $APP_NAME -d -p $HTTP_PORT:$HTTP_PORT -p $TCP_PORT:$TCP_PORT --rm -t $APP_NAME

$ASUSER firefox -new-tab -url http://localhost:$HTTP_PORT/devices -new-tab -url http://localhost:1880/managesupermarket -new-tab -url http://localhost:1880/ui -new-tab -url http://localhost:1880/
