FROM oven/bun:latest

COPY src . .

RUN bun install
RUN bun run --bun build

EXPOSE 3000
CMD ["bun", "run", "--bun", "build/index.js"]