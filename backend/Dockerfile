FROM node:20-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

ENV VITE_BACKEND_URL=http://localhost:3000

RUN npm ci

USER node

CMD ["npm", "start"]

EXPOSE 3000