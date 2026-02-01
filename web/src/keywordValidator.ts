export type KeywordValidationResult = {
    valid: boolean;
    error?: string;
};

export function validateKeyword(keyword: string): KeywordValidationResult {
    const trimmed = keyword.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: "Keyword cannot be empty" };
    }

    if (!/^[a-zA-Z][a-zA-Z_.-]*$/.test(trimmed)) {
        return {
            valid: false,
            error: "Keyword must start with a letter and contain only letters, '_', '.' or '-'"
        };
    }

    return { valid: true };
}
