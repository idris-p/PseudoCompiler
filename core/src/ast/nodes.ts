export type Node =
    | StatementNode
    | ExpressionNode;

export type StatementNode =
    | ProgramNode
    | VariableAssignmentNode
    | PrintNode
    | IfNode
    | SwitchNode
    | ForNode
    | WhileNode
    | PassNode
    | BreakNode;

export type ExpressionNode =
    | InputNode
    | UnaryExpressionNode
    | BinaryExpressionNode
    | NumberNode
    | StringNode
    | BooleanNode
    | IdentifierNode;

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

export type ForNode = {
    type: "For";
    initializer?: StatementNode;
    condition?: ExpressionNode;
    update?: StatementNode;
    body: StatementNode[];
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

export type NumberNode = {
    type: "Number";
    value: number;
};

export type StringNode = {
    type: "String";
    value: string;
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

export type BreakNode = {
    type: "Break";
};