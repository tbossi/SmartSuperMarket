#!/usr/bin/env bash
function alert {
	echo
	echo $1
	echo "----------------------------------------"
	echo
}

# Ask for sudo access
if [ $EUID != 0 ]; then
	sudo "$0" "$@"
	exit $?
fi

#Variables
APP_NAME="smart_supermarket"
SRC_DIR="src"
HTTP_PORT=3000
TCP_PORT=9090
FLOW_FILE="./node-red/smart_supermarket-flows.json"
DATASET_FILE="./dataset/smart_supermarket-dataset.json"

if ! hash dockerd 2>/dev/null; then
	echo "It seems Docker is not yet installed. Fixing..."

	alert "Downloading Docker"
	mkdir temp
	cd temp
	wget https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
	tar xzvf docker-17.04.0-ce.tgz

	alert "Installing Docker"
	cp -r docker/* /usr/bin/
	chmod -R 755 /usr/bin/docker*

	echo "Cleaning up"
	echo
	cd ..
	rm -rf temp
else
	echo "Docker is already installed"
fi


if ! pgrep -x "dockerd" > /dev/null; then
	echo "Starting dockerd daemon"
	dockerd &
else
	echo "dockerd already running"
fi


alert "Building container"
cd $SRC_DIR
docker build -t $APP_NAME .
cd ..

alert "Inserting dataset in mongodb"
mongo $APP_NAME --eval "db.dropDatabase()"
mongoimport --jsonArray --db $APP_NAME --collection products --file $DATASET_FILE

alert "Starting node-red"
node-red $FLOW_FILE > node-red.log 2>&1 &

alert "Starting $APP_NAME"
docker run --name $APP_NAME -p $HTTP_PORT:$HTTP_PORT -p $TCP_PORT:$TCP_PORT --rm -t $APP_NAME &

firefox -new-tab -url http://localhost:$HTTP_PORT/ -new-tab -url http://localhost:1880/