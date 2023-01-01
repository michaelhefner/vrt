FROM bitnami/node:latest
LABEL author="Michael Hefner"
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /var/www/vrt
COPY package-lock.json package.json ./
RUN apt-get update
# RUN npm install -g npm@9.2.0
RUN apt-get purge chromium-browser
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libasound2 libappindicator1 fonts-liberation libgconf-2-4 libnss3 libxss1 xdg-utils libxss1 libgbm1
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome*.deb
# RUN npm audit fix --force

COPY . ./
RUN npm install
# RUN npm install pm2@latest -g
EXPOSE $PORT
ENTRYPOINT ["node", "./bin/www"]
# ENTRYPOINT ["pm2", "start", "./bin/www", "--name", "vrt"]