FROM oven/bun

WORKDIR /app

COPY src/index.ts ./index.ts
COPY src/interpreter.ts ./interpreter.ts
COPY src/types.d.ts ./types.d.ts
RUN bun build --compile index.ts
COPY examples/asts/fib.json /var/rinha/source.rinha.json

CMD ["./index", "/var/rinha/source.rinha.json"]
