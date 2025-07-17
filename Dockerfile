FROM oven/bun:latest

COPY package.json ./
COPY bun.lock ./
COPY src ./

RUN bun install

EXPOSE 3000
CMD ["bun", "build/index.js"]