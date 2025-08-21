FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY --chown=node:node . .

USER node

CMD ["npm", "run", "dev"]

EXPOSE 3000