FROM node:14.16.1
LABEL MAINTAINER Michael Hueter <mthueter@gmail.com>

# RUN npm install pm2@latest --global --quiet
# add local user for security
# RUN groupadd -r nodejs \
#   && useradd -m -r -g nodejs nodejs
# USER nodejs

# copy local files into container, set working directory and user
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY package*.json .
RUN npm install -g nodemon
RUN npm install --production
COPY . /home/nodejs/app

EXPOSE 5000

#CMD ["npm", "start"]
