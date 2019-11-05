FROM node:8

# Create app directory
RUN mkdir -p /usr/src/ApiGateway 
WORKDIR /usr/src/ApiGateway

# Bundle app source
COPY . /usr/src/ApiGateway

# Install app dependencies
RUN  npm install


EXPOSE 1339 
CMD [ "node", "apiGateway.js"]
