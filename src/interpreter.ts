import { Term, Node, File, HashMap, Function } from "./types";

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
        return error(`Variable ${term.text} not found`, term);
      }
    case "If":
      if (interpret(term.condition, env)) {
        return interpret(term.then, env);
      } else {
        return interpret(term.otherwise, env);
      }
    case "Function":
      return term
    case "Call":
      const fn = interpret(term.callee, env) as Function
      fn.parameters.map((param, index) => {
        env[param.text] = interpret(term.arguments[index], env)
      })
      return interpret(fn.value, env)
    default:
      error("Unreachable", term);
    break;
  }
}
