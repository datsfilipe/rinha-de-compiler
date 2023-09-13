FROM oven/bun

WORKDIR /app

COPY package*.json bun.lockb ./
RUN bun install
COPY src/ ./src/
COPY examples/asts/fib.json /var/rinha/source.rinha.json

ENV NODE_ENV production

CMD [ "bun", "run", "start" ]
