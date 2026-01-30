import { CodeStyle } from "./CodeStyle.js";

type UserConfig = {
    codeStyle: CodeStyle;
    switchFallthrough: boolean;
};

export const config: UserConfig = {
    codeStyle: CodeStyle.INDENT,
    switchFallthrough: false,
};