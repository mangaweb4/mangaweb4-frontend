FROM oven/bun:latest

COPY src . .

RUN bun install

EXPOSE 3000
CMD ["bun", "build/index.js"]