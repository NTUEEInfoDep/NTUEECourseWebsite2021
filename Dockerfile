FROM node:12-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./
USER node
RUN npm install --production
COPY --chown=node:node --from=build /app/build /app/build
EXPOSE 8000
ENTRYPOINT ["npm", "run", "server"]
