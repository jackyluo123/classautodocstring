"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionName = void 0;
exports.getClassName = void 0;

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * Grabs the function name
 * @param {*} functionDefinition 
 * @returns 
 */
function getFunctionName(functionDefinition) {
    // (?: ) is match def but don't record it
    // \s is single space
    // + is to keep going as in keep moving to the right for all the spaces
    // so far: match "def "
    // (\w+) means to record all the alnum chars (as in the function name)
    // \( means that the function needs to have a bracket after
    const pattern = /(?:def)\s+(\w+)\s*\(/;
    const match = pattern.exec(functionDefinition);
    if (match === undefined || match === null || match[1] === undefined || match[1] === null) {
        return "";
    }
    return match[1];
}
exports.getFunctionName = getFunctionName;

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * Grabs the class name
 * @param {*} classDefinition 
 * @returns 
 */
 function getClassName(classDefinition) {
    // (?: ) is match class but don't record it
    // \s is single space
    // + is to keep going as in keep moving to the right for all the spaces
    // so far: match "class "
    // (\w+) means to record all the alnum chars (as in the function name)
    // \s* means that there can be 0 or more spaces after the name
    // (\(|\:) means that the char must be ( or :. Classes can be defined with/without inheritence
    const pattern = /(?:class)\s+(\w+)\s*(?:\(|\:)/;
    const match = pattern.exec(classDefinition);
    if (match === undefined || match === null || match[1] === undefined || match[1] === null) {
        return "";
    }
    return match[1];
}
exports.getClassName = getClassName;