"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeFunctionDefinition = void 0;
const logger_1 = require("../logger");

/**
 * Takes the function definition to break it down into components that we want
 * This tokenizing will fail if the user tries to generate the docstring anywhere that is not
 * directly beneath the function definition
 * This is because the original matching logic from autoDocstring is not very good
 * @param {*} functionDefinition 
 * @returns array type
 */
function tokenizeFunctionDefinition(functionDefinition) {
    /**
     * breakdown for definitionPattern
     * ?: means match but don't save results
     * \s+ is white space 1 or more times
     * \w+ is alnum char 1 or more times
     * \s* is white space 0 or more times
     * \( is "("
     * so far this is similar to getting the function name 
     * ([\s\S*]):
     *      \S* is non-white space 0 or more times
     *      [] is character class where the match is valid for any of the chars inside
     *      Then this is pretty much saying grab everything within the original functions 
     *      circle brackets
     * (->\s*(["']?)[\w\[\], |\.]*\3):
     *      After the original circle brackets, functions can have "-> return_type"
     *      (["']?) means to only match " or ' 0 or 1 time(s)
     *      [\w\[\], |\.]* is to match any of \w, "[", "]", ",", " ", or "." any as many times
     *      not sure what the \3 means
     * ?:\s*(?:#.*)?$:
     *      ?: is match but don't save results
     *      \s* white space 0 or more times
     *      (?:#.*)? (match but dont save "#." repeated 0 or more times,) only 0 or 1 time(s) 
     *      $ means the last input must be the above. 
     *      This seems pointless, # means a comment, so why not just stop when we see ":" instead
     */     
    const definitionPattern = /(?:def|class)\s+\w+\s*\(([\s\S]*)\)\s*(->\s*(["']?)[\w\[\], |\.]*\3)?:\s*(?:#.*)?$/;

    const match = definitionPattern.exec(functionDefinition);
    if (match === undefined || match === null || match[1] === undefined || match[1] === null || match[1] === "") {
        return [];
    }
    (0, logger_1.logDebug)("    Match found: Tokenizing the following string:");
    (0, logger_1.logDebug)("    " + match[1].toString());
    const tokens = tokenizeParameterString(match[1]);

    if (match[2] !== undefined && match[2] !== null) {
        tokens.push(match[2]);
    }
    (0, logger_1.logDebug)("    Created the following tokens:");
    for (var tokenLog of tokens) {
        (0, logger_1.logDebug)("    " + tokenLog);
    }

    return tokens;
}
exports.tokenizeFunctionDefinition = tokenizeFunctionDefinition;

/**
 * Uses the class definition line to tokenize the list of parents
 * @param {*} classDefinition 
 */
 function tokenizeClassDefinition(classDefinition) {
    /**
     * search for "class" but don't save it
     * space
     * class name (don't save since we are not interested in it)
     * space
     * \( left bracket
     * save all chars up to the \) right bracket, not inclusive
     */
    const definitionPattern = /(?:class)\s+\w+\s*\(([\s\S]*)\)/;
    const match = definitionPattern.exec(classDefinition);
    if (match === undefined || match === null || match[1] === undefined || match[1] === null || match[1] === "") {
        return [];
    }

    (0, logger_1.logDebug)("    Match found: Tokenizing the following string:");
    (0, logger_1.logDebug)("    " + match[1].toString());

    const tokens = tokenizeParameterString(match[1]);
    if (match[2] !== undefined && match[2] !== null) {
        tokens.push(match[2]);
    }

    (0, logger_1.logDebug)("    Created the following tokens:");
    for (var tokenLog of tokens) {
        (0, logger_1.logDebug)("    " + tokenLog);
    }

    return tokens;
}
exports.tokenizeClassDefinition = tokenizeClassDefinition;

function tokenizeParameterString (parameterString) {
    const stack = [];
    const parameters = [];
    let arg = "";
    let position = parameterString.length - 1;
    // this loop seems to start at the end of the function definition
    // and works backwards
    while (position >= 0) {
        const top = stack[stack.length - 1];
        let char = parameterString.charAt(position);
        switch (true) {
            // 1. Check for top level comma and push arg to array
            case char === "," && stack.length === 0:
                parameters.unshift(arg);
                arg = "";
                position -= 1;
                continue;
            // 2. Check for closing double or single quote of string
            case char === '"' && top === '"':
            case char === "'" && top === "'":
                stack.pop();
                break;
            // 3. Do nothing if quote at top of stack
            case top === '"':
            case top === "'":
                break;
            // 4. Push single and double quotes to stack
            case char === '"':
            case char === "'":
                stack.push(char);
                break;
            // 5. Check for closing of tuples, array, or dicts
            case char === "(" && top === ")":
            case char === "[" && top === "]":
            case char === "{" && top === "}":
                stack.pop();
                break;
            // 6. Do nothing if closing char but no matching char on stack
            case char === "(":
            case char === "[":
            case char === "{":
                break;
            // 7. Push opening char to stack
            case char === ")":
            case char === "]":
            case char === "}":
                stack.push(char);
                break;
            // 8. Disregard whitespace at top level of stack
            case char === " " && stack.length === 0:
            case char === "\n" && stack.length === 0:
            case char === "\t" && stack.length === 0:
                position -= 1;
                continue;
            // 9. Surround pipe character with whitespace
            case char === "|":
                char = ` ${char}`;
                arg = ` ${arg}`;
                break;
        }
        arg = char + arg;
        position -= 1;
    }
    if (arg.length > 0) {
        parameters.unshift(arg);
    }
    return parameters;
}