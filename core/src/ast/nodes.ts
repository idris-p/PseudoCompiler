export type Node =
    | StatementNode
    | ExpressionNode;

export type StatementNode =
    | ProgramNode
    | VariableAssignmentNode
    | PrintNode
    | InputStatementNode
    | IfNode
    | SwitchNode
    | ForNode
    | WhileNode
    | DoUntilNode
    | PassNode
    | ContinueNode
    | BreakNode;

export type ExpressionNode =
    | InputNode
    | UnaryExpressionNode
    | BinaryExpressionNode
    | IndexExpressionNode
    | SliceExpressionNode
    | NumberNode
    | StringNode
    | ConcatNode
    | BooleanNode
    | IdentifierNode
    | CallExpressionNode
    | MemberExpressionNode;

export type ProgramNode = {
    type: "Program";
    body: StatementNode[];
};

export type VariableAssignmentNode = {
    type: "VariableAssignment";
    name: string;
    value: ExpressionNode;
};

export type PrintNode = {
    type: "Print";
    expression: ExpressionNode;
};

export type InputNode = {
    type: "Input";
    prompt?: ExpressionNode;
};

export type InputStatementNode = {
    type: "InputStatement";
    input: InputNode;
};

export type IfNode = {
    type: "If";
    condition: ExpressionNode;
    thenBody: StatementNode[];
    elseBody?: StatementNode[];
};

export type SwitchNode = {
    type: "Switch";
    expression: ExpressionNode;
    cases: SwitchCaseNode[];
    defaultBody?: StatementNode[];
};

export type SwitchCaseNode = {
    caseExpression: ExpressionNode;
    body: StatementNode[];
};

export type WhileNode = {
    type: "While";
    condition: ExpressionNode;
    body: StatementNode[];
};

export type DoUntilNode = {
    type: "DoUntil";
    condition: ExpressionNode;
    body: StatementNode[];
};

export type ForNode = {
    type: "For";
    initializer?: StatementNode;
    condition?: ExpressionNode;
    update?: StatementNode;
    body: StatementNode[];

    range?: {
        variable: string;
        start: ExpressionNode;
        end: ExpressionNode;
        step: ExpressionNode;
        startInclusive: boolean;
        endInclusive: boolean;
    };
};

export type UnaryExpressionNode = {
    type: "UnaryExpression";
    operator: string;
    operand: ExpressionNode;
};

export type BinaryExpressionNode = {
    type: "BinaryExpression";
    operator: string;
    left: ExpressionNode;
    right: ExpressionNode;
};

export type IndexExpressionNode = {
    type: "IndexExpression";
    object: ExpressionNode;
    index: ExpressionNode;
};

export type SliceExpressionNode = {
    type: "SliceExpression";
    object: ExpressionNode;
    start?: ExpressionNode;
    end?: ExpressionNode;
    step?: ExpressionNode;
};

export type NumberNode = {
    type: "Number";
    value: number;
};

export type StringNode = {
    type: "String";
    value: string;
};

export type ConcatNode = {
  type: "Concat";
  parts: ExpressionNode[];
};

export type BooleanNode = {
    type: "Boolean";
    value: boolean;
};

export type IdentifierNode = {
    type: "Identifier";
    name: string;
};

export type PassNode = {
    type: "Pass";
};

export type ContinueNode = {
    type: "Continue";
};

export type BreakNode = {
    type: "Break";
};

export type CallExpressionNode = {
    type: "CallExpression";
    callee: ExpressionNode;
    args: ExpressionNode[];
}

export type MemberExpressionNode = {
    type: "MemberExpression";
    object: ExpressionNode;
    property: string;
}