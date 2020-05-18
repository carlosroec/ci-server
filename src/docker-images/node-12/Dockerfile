FROM node:12

WORKDIR /usr/src/app

ARG REPO_URL
ARG REPO_NAME

RUN git clone $REPO_URL

WORKDIR /usr/src/app/$REPO_NAME

RUN npm install

CMD ["npm", "run", "test"]
