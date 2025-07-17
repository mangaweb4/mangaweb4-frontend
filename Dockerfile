FROM oven/bun:latest

COPY src . .

RUN bun install
RUN bun run build

EXPOSE 3000
CMD ["bun", "build/index.js"]