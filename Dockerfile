FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --production

EXPOSE 3000
CMD ["node", "build"]