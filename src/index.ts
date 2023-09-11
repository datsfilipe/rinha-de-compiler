import { resolve } from "path";
import { interpret } from "./interpreter";

interpret(await Bun.file(resolve(process.argv.at(-1) as string)).json())
console.log(Bun.nanoseconds())
