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

# Variables
APP_NAME="smart_supermarket"
SRC_DIR="src"
HTTP_PORT=3000
TCP_PORT_SHELVES=9090
TCP_PORT_CARTS=9091
TCP_PORT_TOTEMS=9092
TCP_PORT_PAYMENT=10000
FLOW_FILE="./node-red/smart_supermarket-flows.json"
DATASET_FILE="./dataset/smart_supermarket-dataset.json"
MAP_FILE="./dataset/smart_supermarket-map.json"

if ! hash dockerd 2>/dev/null; then
	echo "It seems Docker is not yet installed. Fixing..."

	alert "Downloading Docker (this can take some time...)"
	mkdir temp
	cd temp
	wget https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
	
	alert "Installing Docker"
	tar xzvf docker-17.04.0-ce.tgz
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


alert "Building container (this can take some time...)"
cd $SRC_DIR
docker build --no-cache -t $APP_NAME .
cd ..

alert "Inserting dataset in mongodb"
mongo $APP_NAME --eval "db.dropDatabase()"
mongoimport --jsonArray --db $APP_NAME --collection products --file $DATASET_FILE
mongoimport --jsonArray --db $APP_NAME --collection map --file $MAP_FILE

alert "Starting node-red"
node-red $FLOW_FILE > node-red.log 2>&1 &

alert "Starting $APP_NAME"
docker run --name $APP_NAME -p $HTTP_PORT:$HTTP_PORT -p $TCP_PORT_SHELVES:$TCP_PORT_SHELVES -p $TCP_PORT_CARTS:$TCP_PORT_CARTS -p $TCP_PORT_TOTEMS:$TCP_PORT_TOTEMS -p $TCP_PORT_PAYMENT:$TCP_PORT_PAYMENT --rm -t $APP_NAME &

firefox -new-tab -url http://localhost:$HTTP_PORT/devices -new-tab -url http://localhost:1880/ui -new-tab -url http://localhost:1880/


# when firefox is closed we can stop background processes:
alert "Stopping background processes (just wait...)"
kill $(ps aux | grep node-red | awk '{print $2}')
docker stop $(docker ps -a -q -f name=$APP_NAME)
