import { interpret } from "./interpreter";

const ast = await Bun.readableStreamToJSON(Bun.stdin.stream())
interpret(ast.expression)
console.log(Bun.nanoseconds())
