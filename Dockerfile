FROM arm64v8/node:lts-slim 

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# RUN npm run build  # <-- THIS WAS MISSING

EXPOSE 4200
CMD ["npm", "start", "--", "--host=0.0.0.0"]
