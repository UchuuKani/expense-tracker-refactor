# using lts version of node?
FROM node:14
# Create and set our backend app directory in the container
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# only copying package.json/package-lock.json instead of whole source here so that this layer is cached when docker builds the image?
COPY package*.json ./
# RUN command happens at image build time and adds a new layer?
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source - copy source code from host working directory where Dockerfile is to the container's working directory set by WORKDIR
COPY . .
# exposing port 8080 in the container?
EXPOSE 8080
# CMD runs when?
CMD [ "npm", "run", "dev" ]