import { Term, Node, File } from "./types";

const error = (message: string, node: Node) => {
  console.error(`${message}
    at: start -> ${node.location.start}
    at: end -> ${node.location.end}
    at: file -> ${node.location.filename}
  `);

  process.exit(1);
};

export function interpret(node: Node): any {
  if ((node as File)?.expression) {
    return interpret((node as File).expression);
  }

  const term = node as Term;

  switch (term.kind) {
    case "Print":
      console.log(interpret(term.value));
    case "Str":
      return term.value;
    case "Int":
      return term.value;
    case "Bool":
      return term.value;
    case "Binary":
      switch (term.op) {
        case "Add":
          return interpret(term.lhs) + interpret(term.rhs);
        case "Sub":
          return interpret(term.lhs) - interpret(term.rhs);
        case "Mul":
          return interpret(term.lhs) * interpret(term.rhs);
        case "Div":
          return interpret(term.lhs) / interpret(term.rhs);
        case "Rem":
          return interpret(term.lhs) % interpret(term.rhs);
        case "Eq":
          return interpret(term.lhs) === interpret(term.rhs);
        case "Neq":
          return interpret(term.lhs) !== interpret(term.rhs);
        case "Lt":
          return interpret(term.lhs) < interpret(term.rhs);
        case "Gt":
          return interpret(term.lhs) > interpret(term.rhs);
        case "Lte":
          return interpret(term.lhs) <= interpret(term.rhs);
        case "Gte":
          return interpret(term.lhs) >= interpret(term.rhs);
        case "And":
          return interpret(term.lhs) && interpret(term.rhs);
        case "Or":
          return interpret(term.lhs) || interpret(term.rhs);
        default:
          error("Unreachable", term);
      }
    default:
      error("Unreachable", term);
  }
}
