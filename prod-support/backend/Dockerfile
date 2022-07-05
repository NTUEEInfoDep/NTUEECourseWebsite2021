FROM node:14-alpine

# setup working directory
WORKDIR /app

# install node_modules in the container
COPY ["package.json", "package-lock*.json", "./"]
RUN npm install

COPY ["./server", "./server"]
COPY [".env", "./"]
# react-scripts run on port 3000
EXPOSE 8000


# Environment overwrite
# ENV MONGO_HOST course-mongodb
# ENV REDIS_HOST course-redisdb

# startup command
CMD ["npm", "run", "server"]
