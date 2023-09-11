type Location = {
  start: number;
  end: number;
  filename: string;
}

export type File = {
  name: string;
  expression: Term;
  location: Location;
}

type Parameter = {
  text: string;
  location: Location;
}

type Var = {
  kind: "Var";
  text: string;
  location: Location;
}

type Function = {
  kind: "Function";
  parameters: Parameter[];
  value: Term;
  location: Location;
}

type Call = {
  kind: "Call";
  callee: Term;
  arguments: Term[];
  location: Location;
}

type Let = {
  kind: "Let";
  name: Parameter;
  value: Term;
  next: Term;
  location: Location;
}

type Str = {
  kind: "Str";
  value: string;
  location: Location;
}

type Int = {
  kind: "Int";
  value: number;
  location: Location;
}

type Bool = {
  kind: "Bool";
  value: boolean;
  location: Location;
}

enum BinaryOp {
  Add,
  Sub,
  Mul,
  Div,
  Rem,
  Eq,
  Neq,
  Lt,
  Gt,
  Lte,
  Gte,
  And,
  Or
}

type Binary = {
  kind: "Binary";
  lhs: Term;
  rhs: Term;
  op: BinaryOp;
  location: Location;
}

type If = {
  kind: "If";
  condition: Term;
  then: Term;
  otherwise: Term;
  location: Location;
}

type Tuple = {
  kind: "Tuple";
  first: Term;
  second: Term;
  location: Location;
}

type First = {
  kind: "First";
  value: Term;
  location: Location;
}

type Second = {
  kind: "Second";
  value: Term;
  location: Location;
}

type Print = {
  kind: "Print";
  value: Term;
  location: Location;
}

export type Term = Var | Function | Call | Let | Str | Int | Bool | Binary | If | Tuple | First | Second | Print;

export type Node = File | Term;
