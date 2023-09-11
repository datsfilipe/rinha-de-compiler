import { resolve } from "path";
import { interpret } from "./interpreter";
import type { HashMap, Term } from "./types";

const env: HashMap<Term> = {}
interpret(await Bun.file(resolve(process.argv.at(-1) as string)).json(), env)
console.log(Bun.nanoseconds())
