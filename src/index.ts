import { interpret } from "./interpreter";

let rawData = Bun.file("./examples/asts/hello.json");
let ast = await rawData.json()
interpret(ast.expression)
