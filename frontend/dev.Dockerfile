FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

CMD ["/bin/sh", "scripts/dev_docker_container.bash"]

EXPOSE 5173