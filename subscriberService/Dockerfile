FROM node:8

# Create app directory
RUN mkdir -p /usr/src/reports
WORKDIR /usr/src/reports

# Bundle app source
COPY . /usr/src/reports

# Install app dependencies
RUN WITH_SASL=0 npm install

CMD [ "node", "index.js"]
