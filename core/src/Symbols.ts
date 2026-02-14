export const COMMENT_SYMBOLS = ["#", "//", "%", "--"] as const;
export type CommentSymbol = typeof COMMENT_SYMBOLS[number];

export const ASSIGNMENT_SYMBOLS = ["=", "<-", ":="] as const;
export type AssignmentSymbol = typeof ASSIGNMENT_SYMBOLS[number];