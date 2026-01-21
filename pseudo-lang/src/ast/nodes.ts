export type Node =
    | StatementNode
    | ExpressionNode;

export type StatementNode =
    | ProgramNode
    | VariableAssignmentNode
    | PrintNode
    | IfNode
    | WhileNode
    | PassNode;

export type ExpressionNode =
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

export type IfNode = {
    type: "If";
    condition: ExpressionNode;
    thenBody: StatementNode[];
    elseBody?: StatementNode[];
};

export type WhileNode = {
    type: "While";
    condition: ExpressionNode;
    body: StatementNode[];
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