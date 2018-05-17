#!/usr/bin/env bash
set -e
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

alert "Stopping background processes (just wait...)"
$(kill $(ps aux | grep node-red | awk '{print $2}')) | true
docker stop $(docker ps -a -q -f name=smart_supermarket)
