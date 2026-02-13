export const COMMENT_SYMBOLS = ["#", "//", "%", "--"] as const;
export type CommentSymbol = typeof COMMENT_SYMBOLS[number];