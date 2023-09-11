import { Term, Node, File, HashMap } from "./types";

const error = (message: string, node: Node) => {
  console.error(`${message}
    at: start -> ${node.location.start}
    at: end -> ${node.location.end}
    at: file -> ${node.location.filename}
  `);

  process.exit(1);
};

export function interpret(node: Node, env: HashMap<Term>): any {
  if ((node as File)?.expression) {
    return interpret((node as File).expression, env);
  }

  const term = node as Term;

  switch (term.kind) {
    case "Print":
      console.log(interpret(term.value, env));
    case "Str":
      return term.value;
    case "Int":
      return term.value;
    case "Bool":
      return term.value;
    case "Binary":
      switch (term.op) {
        case "Add":
          return interpret(term.lhs, env) + interpret(term.rhs, env);
        case "Sub":
          return interpret(term.lhs, env) - interpret(term.rhs, env);
        case "Mul":
          return interpret(term.lhs, env) * interpret(term.rhs, env);
        case "Div":
          return interpret(term.lhs, env) / interpret(term.rhs, env);
        case "Rem":
          return interpret(term.lhs, env) % interpret(term.rhs, env);
        case "Eq":
          return interpret(term.lhs, env) === interpret(term.rhs, env);
        case "Neq":
          return interpret(term.lhs, env) !== interpret(term.rhs, env);
        case "Lt":
          return interpret(term.lhs, env) < interpret(term.rhs, env);
        case "Gt":
          return interpret(term.lhs, env) > interpret(term.rhs, env);
        case "Lte":
          return interpret(term.lhs, env) <= interpret(term.rhs, env);
        case "Gte":
          return interpret(term.lhs, env) >= interpret(term.rhs, env);
        case "And":
          return interpret(term.lhs, env) && interpret(term.rhs, env);
        case "Or":
          return interpret(term.lhs, env) || interpret(term.rhs, env);
        default:
          error("Unreachable", term);
      }
      break;
    case "Let":
      return interpret(term.next, { ...env, [term.name.text]: interpret(term.value, env) });
    case "Var":
      if (env[term.text]) {
        return env[term.text];
      } else {
        error(`Variable ${term.text} not found`, term);
      }
    default:
      error("Unreachable", term);
    break;
  }
}
