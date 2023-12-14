#MAINTAINER liheng<lzheng99@wisc.com>

# Use docker:dind as the base image
FROM docker:dind

# Install necessary packages for adding the JDK repository
RUN apk add --no-cache openjdk17

ENV MYPATH /app
WORKDIR $MYPATH

ADD server.jar /app/server.jar
ADD simulator/Dockerfile /app/Dockerfile
ADD simulator/src /app/src

COPY commands.sh /app/commands.sh
RUN chmod +x /app/commands.sh

ENTRYPOINT ["/app/commands.sh"]

EXPOSE 9999

