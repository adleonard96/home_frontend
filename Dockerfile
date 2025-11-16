FROM --platform=arm64 node:latest

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
# RUN npm run build  # <-- THIS WAS MISSING

EXPOSE 4200
CMD ["npm", "start", "--", "--host=0.0.0.0"]
