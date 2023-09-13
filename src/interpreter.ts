import { Term, Node, File, HashMap, Function } from "./types";

const error = (message: string, node: Node, help?: string) => {
  console.error(`\x1b[1mError: ${message}\n`);
  console.log(`Begin of statement at char ${node.location.start} and end of statement at char ${node.location.end}. Not very useful, huh?\n`)
  console.trace(`\x1b[1mStack trace: \x1b[37m-> ${node.location.filename}`);
  if (help) {
    console.info(`\n\x1b[1m\x1b[34mHelp: ${help}`);
  }
  console.log("-----------------------------------------------")
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
      env[term.name.text] = interpret(term.value, env);
      return interpret(term.next, env);
    case "Var":
      return env[term.text] ?? error(`Variable ${term.text} not found`, term, "Did you forget to declare it? You can declare it with `let` keyword.");
    case "Tuple":
      return [interpret(term.first, env), interpret(term.second, env)];
    case "First":
      return interpret(term.value, env)[0] ?? error("First expects a valid tuple", term, "The correct syntax is `first((1, 2))` or pass a variable that contains a tuple.")
    case "Second":
      return interpret(term.value, env)[1] ?? error("Second expects a valid tuple", term, "The correct syntax is `second((1, 2))` or pass a variable that contains a tuple.")
    case "If":
      if (interpret(term.condition, env) === true) {
        return interpret(term.then, env);
      }
      return interpret(term.otherwise, env);
    case "Function":
      return term
    case "Call":
      const callee = interpret(term.callee, env);
      if ((callee as Term)?.kind === "Function")
        return clojure(callee, env).call(term.arguments.map((arg) => interpret(arg, env)));
      return error("Attempt to call a non-function value", term, "The correct syntax is `functionName(arguments)` or pass a variable that contains a function.")
    default:
      return error("Unreachable", term);
  }
}
