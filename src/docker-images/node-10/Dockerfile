FROM node:10

WORKDIR /usr/src/app

ARG REPO_URL
ARG REPO_NAME

RUN git clone $REPO_URL

WORKDIR /usr/src/app/$REPO_NAME

RUN npm install

CMD git pull && npm run test
