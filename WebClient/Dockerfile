FROM node:8

# create app directory

RUN mkdir -p /usr/src/WebClient

WORKDIR /usr/src/WebClient

# Bundle app source
COPY . /usr/src/WebClient

#Install app dependencies

RUN WITH_SASL=0 npm install

RUN npm run build

RUN npm run postinstall


FROM nginx:1.14.1

WORKDIR /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/WebClient

RUN mkdir -p /usr/share/nginx/html/BookingEngine

COPY --from=0 /usr/src/WebClient/dist ./WebClient/dist
COPY --from=0 /usr/src/WebClient/src ./WebClient/src
COPY --from=0 /usr/src/WebClient/index.html ./WebClient
COPY --from=0 /usr/src/WebClient/login.html ./WebClient
COPY --from=0 /usr/src/WebClient/Release_notes.html ./WebClient
COPY --from=0 /usr/src/WebClient/Release_notes_QA.html ./WebClient


COPY --from=0 /usr/src/WebClient/BookingEngine/dist ./BookingEngine/dist
COPY --from=0 /usr/src/WebClient/BookingEngine/src ./BookingEngine/src
COPY --from=0 /usr/src/WebClient/BookingEngine/index.html ./BookingEngine
COPY --from=0 /usr/src/WebClient/BookingEngine/login.html ./BookingEngine
COPY --from=0 /usr/src/WebClient/BookingEngine/error.html ./BookingEngine
COPY --from=0 /usr/src/WebClient/BookingEngine/Release_notes.html ./BookingEngine
COPY --from=0 /usr/src/WebClient/BookingEngine/Release_notes_QA.html ./BookingEngine

RUN ls /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf