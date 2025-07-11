FROM node:20 as puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_CACHE_DIR=/home/node/puppeteer_cache

WORKDIR /home/node/
COPY src/package.json /home/node/
RUN apt-get update && apt-get install xz-utils -y
RUN npm i && npx puppeteer browsers install firefox

FROM gcr.io/kctf-docker/challenge

# puppeteer firefox needs dependencies so we just install firefox but dont use it
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends\
        firefox \
        packagekit-gtk3-module \
        gnupg2 \
        wget \
        ca-certificates \
        fonts-liberation \
        libappindicator3-1 \
        libasound2t64 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgbm1 \
        libgcc1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxshmfence1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        xdg-utils \
        pciutils \
        dbus-x11 \
        libegl1 \
        xvfb \
        nodejs \
    && rm -rf /var/lib/apt/lists/*


COPY --from=puppeteer /home/node/puppeteer_cache /home/user/puppeteer_cache/
COPY --from=puppeteer /home/node/node_modules /home/user/node_modules/
COPY src/ /home/user/
COPY start.sh /home/user

RUN mkdir /home/user/.cache /home/user/.mozilla

RUN chmod 755 /home/user/start.sh

CMD kctf_setup && \
    mount -t tmpfs none /tmp && \
    mount -t tmpfs none /home/user/.cache && \
    mount -t tmpfs none /home/user/.mozilla && \
    mkdir /tmp/firefox-userdata && chmod o+rwx /tmp/firefox-userdata && \
    kctf_drop_privs env FLAG="${FLAG}" PUPPETEER_CACHE_DIR="/home/user/puppeteer_cache" xvfb-run /home/user/start.sh
