# Set the base image to Ubuntu (why not alpine or some other smaller image?)
FROM ubuntu:trusty

# Update the repository and install Redis Server
RUN apt-get update && apt-get install -y redis-server

# Expose Redis port 6380
EXPOSE 6380

# Copy Redis Config
ADD redis.conf /etc/redis

# Run Redis Server
ENTRYPOINT  ["/usr/bin/redis-server"]
