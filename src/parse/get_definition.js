"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionDefinition = void 0;
exports.getClassDefinition = void 0;
const utilities_1 = require("./utilities");
const logger_1 = require("../logger");



/**
 * Based off of python function autodoc extension
 * For some reason this function does not return the function definition
 * It returns everything from the function definition (inclusive) to the
 * current line
 * @param {*} document 
 * @param {*} linePosition 
 * @returns 
 */
function getFunctionDefinition(document, linePosition) {
    (0, logger_1.logDebug)("    Grabbing preceding lines...");
    const precedingLines = getPrecedingLines(document, linePosition);
    (0, logger_1.logDebug)("    Got preceding lines!");
    const precedingText = precedingLines.join(" ");
    // Don't parse if the preceding line is blank
    const precedingLine = precedingLines[precedingLines.length - 1];
    if (precedingLine === undefined || precedingLine === null || (0, utilities_1.blankLine)(precedingLine)) {
        return "";
    }
    const pattern = /\b((async\s+)?\s*def)\b/g;
    // Get starting index of last def match in the preceding text
    let index;
    while (pattern.test(precedingText)) {
        index = pattern.lastIndex - RegExp.lastMatch.length;
    }
    if (index === undefined) {
        return "";
    }
    const lastFunctionDef = precedingText.slice(index);
    return lastFunctionDef.trim();
}
exports.getFunctionDefinition = getFunctionDefinition;

/**
 * Based off of python function autodoc extension
 * @param {*} document 
 * @param {*} linePosition 
 * @returns 
 */
 function getClassDefinition(document, linePosition) {
    (0, logger_1.logDebug)("    Grabbing preceding lines...");
    const precedingLines = getPrecedingLines(document, linePosition);
    (0, logger_1.logDebug)("    Got preceding lines!");
    const precedingText = precedingLines.join(" ");

    var i = precedingLines.length - 1;
    const pattern = /\b(\s*class)\b/g;
    // Don't parse if the preceding line is blank
    // const precedingLine = precedingLines[precedingLines.length - 1];
    // if (precedingLine === undefined || precedingLine === null || (0, utilities_1.blankLine)(precedingLine)) {
    //     return "";
    // }
    
    //const pattern = /\b((async\s+)?\s*class)\b/g;
    // Get starting index of last def match in the preceding text
    // let index;
    // while (pattern.test(precedingText)) {
    //     index = pattern.lastIndex - RegExp.lastMatch.length;
    // }
    // if (index === undefined) {
    //     return "";
    // }
    // const lastClassDef = precedingText.slice(index);
    // return lastClassDef.trim();
    while (i >= 0) {
        var precedingLine = precedingLines[i];
        if (precedingLine === undefined || precedingLine === null || (0, utilities_1.blankLine)(precedingLine)) {
            index = index - 1;
            continue;
        }
        let index;
        if (pattern.test(precedingLine)) {
            return precedingLine;
        }
        index = index - 1;
    }
    return "";
}
exports.getClassDefinition = getClassDefinition;


/**
 * Grabs all the lines from the start of the document to the current line
 * Also preprocessed them using utilities
 * @param {*} document 
 * @param {*} linePosition 
 * @returns 
 */
function getPrecedingLines(document, linePosition) {
    const lines = document.split("\n");
    const rawPrecedingLines = lines.slice(0, linePosition);
    const precedingLines =(0, utilities_1.preprocessLines)(rawPrecedingLines);
    return precedingLines;
}