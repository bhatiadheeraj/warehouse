tag=1.1.13
docker build -t soichih/warehouse ..
if [ ! $? -eq 0 ]; then
    echo "failed to build"
    exit
fi
docker tag soichih/warehouse soichih/warehouse:$tag
docker push soichih/warehouse:$tag
