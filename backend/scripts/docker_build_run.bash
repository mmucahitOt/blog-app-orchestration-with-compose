#!/bin/bash

docker build -t todo-backend .
docker run -p 3000:3000 todo-backend