#!/bin/sh
dockerd & #run in -d mod to avoid blocking other shell commands
sleep 1 #wait until dockerd is running
docker build --no-cache -t sim:1.2 .
java -jar /app/server.jar

