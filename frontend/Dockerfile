FROM node:20-alpine AS test_stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3000

RUN chmod +x scripts/test.sh
RUN ./scripts/test.sh

FROM node:20-alpine AS build_stage

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3000

RUN npm ci

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build_stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80