FROM node:16-alpine

COPY  package.json /tmp/package.json

RUN cd /tmp && npm install -q

# RUN npm dedupe

COPY  ./ /src

RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src

EXPOSE 4000

CMD ["node", "src/index.js"]