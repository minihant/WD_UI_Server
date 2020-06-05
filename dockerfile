FROM node:12.13.1-alpine

# Create app directory
WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
EXPOSE 8082
CMD ["node", "server.js"]
 
