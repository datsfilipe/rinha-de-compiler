import type { Term, Node, File } from "./types";

export function interpret(node: Node) {
  if ((node as File)?.expression) {
    return interpret((node as File).expression);
  }

  const term = node as Term;

  switch (term.kind) {
    case "Print":
      console.log(interpret(term.value));
    case "Str":
      return term.value;
  }
}
