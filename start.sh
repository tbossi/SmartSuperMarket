#!/usr/bin/env bash
function alert {
	echo
	echo $1
	echo "----------------------------------------"
	echo
}

# Extracting options
DOCKER=true
SUDO_MODE_OPTIONS=()
while test $# -gt 0; do
	case "$1" in
		-h|--help)
			echo "This is the script to run Smart Super Market project"
			echo "Note: this script requires admin privileges to run. You will need to enter your password." 
			echo
			echo "./start [options]"
			echo
			echo "options:"
			echo "-h, --help		Show this help"
			echo "--no-docker		Try to run the project without Docker (it may not run). All other Docker related options will be ignored"
			echo "--no-cache		Avoid using cache during Docker container build"
			exit 0
			;;
		--no-docker)
			DOCKER=false
			echo "Warning:"
			echo "If you have an old node.js version the project may fail to run. If so, please run without --no-docker option"
			echo
			shift
			;;
		--no-cache)
			SUDO_MODE_OPTIONS+=('--no-cache')
			DOCKER_ADDITIONAL_OPTIONS="--no-cache"
			shift
			;;
		*)
			echo "Unrecognized option $1"
			exit -1
			;;
	esac
done

# Ask for sudo access only if running with docker
if [[ "$DOCKER" == true && $EUID != 0 ]]; then
	echo "Running with docker requires admin privileges"
	if [ ${#SUDO_MODE_OPTIONS[@]} -eq 0 ]; then
		sudo "$0"
		exit $?
	else
		sudo "$0" "${SUDO_MODE_OPTIONS[*]}"
		exit $?
	fi	
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

if [ "$DOCKER" == true ]; then
	if ! hash dockerd 2>/dev/null; then
		echo "It seems Docker is not yet installed. Fixing..."

		alert "Downloading Docker (this can take some time...)"
		mkdir temp
		cd temp
		wget --no-check-certificate https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
	
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
		dockerd --log-level error &
	else
		echo "dockerd already running"
	fi


	alert "Building container (this can take some time...)"
	cd $SRC_DIR
	docker build $DOCKER_ADDITIONAL_OPTIONS -t $APP_NAME .
	cd ..
else
	cd $SRC_DIR
	npm install
	npm rebuild node-sass
	cd ..
fi

alert "Inserting dataset in mongodb"
mongo $APP_NAME --eval "db.dropDatabase()"
mongoimport --jsonArray --db $APP_NAME --collection products --file $DATASET_FILE
mongoimport --jsonArray --db $APP_NAME --collection map --file $MAP_FILE

alert "Starting node-red"
node-red $FLOW_FILE > node-red.log 2>&1 &

alert "Starting $APP_NAME"
if [ "$DOCKER" == true ]; then
	docker run --name $APP_NAME \
		-p $HTTP_PORT:$HTTP_PORT \
		-p $TCP_PORT_SHELVES:$TCP_PORT_SHELVES \
		-p $TCP_PORT_CARTS:$TCP_PORT_CARTS \
		-p $TCP_PORT_TOTEMS:$TCP_PORT_TOTEMS \
		-p $TCP_PORT_PAYMENT:$TCP_PORT_PAYMENT \
		-d --rm -t $APP_NAME
else
	cd $SRC_DIR
	npm start &
	cd ..
fi

firefox -new-tab -url http://localhost:$HTTP_PORT/ \
    -new-tab -url http://localhost:$HTTP_PORT/devices \
	-new-tab -url http://localhost:1880/ui \
	-new-tab -url http://localhost:1880/


# when firefox is closed we can stop background processes:
alert "Stopping background processes (just wait...)"
kill $(ps aux | grep node-red | awk '{print $2}')
if [ "$DOCKER" == true ]; then
	docker stop $(docker ps -a -q -f name=$APP_NAME)
fi
