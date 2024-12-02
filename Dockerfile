FROM node:latest
WORKDIR /usr/src/app
COPY package-lock.json ./
COPY package.json ./
RUN npm install
COPY . .

# Download assets
RUN mkdir -p public
ARG ASSETS_URL="https://www.dropbox.com/scl/fi/ksqzsagi8tmj2fylnyvmz/assets.zip?rlkey=6fty36xzwovj6lyzzl1xgdhk1&st=q8nt59qi&dl=1"
ARG ASSET_OUT="./public/assets.zip"
RUN if [ ! -f ${ASSET_OUT} ]; then wget -O ${ASSET_OUT} ${ASSETS_URL}; fi

RUN npm run build
FROM nginx:stable-alpine
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
