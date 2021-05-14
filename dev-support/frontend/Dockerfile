FROM node:14-alpine

# setup working directory
WORKDIR /app

# install node_modules in the container
COPY ["package.json", "package-lock*.json", "./"]
RUN npm install

# react-scripts run on port 3000
EXPOSE 3000

# startup command
CMD ["npm", "start"]