sudo kill $(ps aux | grep node-red | awk '{print $2}')
docker stop $(docker ps -a -q -f name=smart_supermarket)
