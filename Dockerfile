# Use a base image with JDK 21
FROM --platform=linux/arm64 node:24

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies using npm with caching to speed up subsequent builds
RUN npm install

# Copy all application source files into the container
COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host=0.0.0.0"]