docker build -t node_app .
docker run -p 3000:3000 --rm -it node_app