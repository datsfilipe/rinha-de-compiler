import { Term, Node, File, HashMap, Function } from "./types";

const error = (message: string, node: Node) => {
  console.error(`${message}
    at: start -> ${node.location.start}
    at: end -> ${node.location.end}
    at: file -> ${node.location.filename}
  `);
  process.exit(1);
};

const clojure = (fn: Function, env: HashMap<Term>) => {
  const call = (args: Term[]) => {
    const newEnv = { ...env };
    for (let i = 0; i < fn.parameters.length; i++) {
      newEnv[fn.parameters[i].text] = args[i];
    }
    return interpret(fn.value, newEnv);
  };
  return { call };
};

type Interpreter = (node: Node, env: HashMap<Term>) => any;

export const interpret: Interpreter = (node, env) => {
  if ((node as File)?.expression) {
    return interpret((node as File).expression, env);
  }
  const term = node as Term;

  switch (term.kind) {
    case "Print":
      const value = interpret(term.value, env);

      if ((value as Term)?.kind === "Function")
        return console.log("<#closure>");
      return console.log(value);
    case "Str":
      return term.value;
    case "Int":
      return term.value;
    case "Bool":
      return term.value;
    case "Binary":
      switch (term.op) {
        case "Add":
          if ((term.lhs.kind === "Str") || (term.rhs.kind === "Str"))
            return `${interpret(term.lhs, env)}${interpret(term.rhs, env)}`
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
          return error("Unreachable", term);
      }
    case "Let":
      return interpret(term.next, { ...env, [term.name.text]: interpret(term.value, env) });
    case "Var":
      const varValue = env[term.text]
      if (varValue === undefined)
        return error(`Variable ${term.text} not found`, term);
      return varValue;
    case "Tuple":
      return [interpret(term.first, env), interpret(term.second, env)];
    case "First":
      if ((term.value.kind === "Tuple") || (term.value.kind === "Var"))
        return interpret(term.value, env)[0];;
      return error("First expects a valid tuple", term);
    case "Second":
      if ((term.value.kind === "Tuple") || (term.value.kind === "Var"))
        return interpret(term.value, env)[1];
      return error("Second expects a valid tuple", term);
    case "If":
      if (interpret(term.condition, env) === true) {
        return interpret(term.then, env);
      }
      return interpret(term.otherwise, env);
    case "Function":
      return term
    case "Call":
      return clojure(interpret(term.callee, env), env).call(term.arguments.map((arg) => interpret(arg, env)));
    default:
      return error("Unreachable", term);
  }
}
