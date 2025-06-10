FROM node:17

VOLUME /tmp
VOLUME /home/brain
VOLUME /etc/fonts
VOLUME /usr/share/fonts/truetype/msttcorefonts
VOLUME /usr/share/fontconfig

WORKDIR /home/node/brain-agriculture-api

COPY ./package*.json ./

RUN npm install

COPY  . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
