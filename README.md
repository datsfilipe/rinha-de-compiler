# rinha-ts

A TypeScript implementation of the "Rinha de Compiladores" project, which is basically a competition where you have to write a compiler or interpreter for a fictional language. My goal is not to win, but to learn something (excuses because I didn't even knew how to do an interpreter before this project).


## Running

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev astpath
```

Where `astpath` is the path to the AST file.

### Or With Docker

```bash
docker build -t rinha-ts .
docker run rinha-ts:latest # it will read AST file from /var/rinha/source.rinha.json as specified
```

This project was created using `bun init` in bun v0.8.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
