"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultIndentation = exports.blankLine = exports.indentationOf = exports.preprocessLines = exports.getIndentation = void 0;

function getIndentation(line) {
    const whiteSpaceMatches = line.match(/^[^\S\r]+/);
    
    if (whiteSpaceMatches === undefined || whiteSpaceMatches === null) {
        return "";
    }
    return whiteSpaceMatches[0];
}
exports.getIndentation = getIndentation;

/**
 * Preprocess an array of lines
 * For example, gets rid of spaces and comments
 * @param {*} lines to be preprocessed
 */
function preprocessLines(lines) {
    return lines
        .map(line => line.trim())
        .filter((line) => !line.startsWith("#"));
}
exports.preprocessLines = preprocessLines;


function indentationOf(line) {
    return getIndentation(line).length;
}
exports.indentationOf = indentationOf;


function blankLine(line) {
    return line.match(/[^\s]/) === undefined || line.match(/[^\s]/) === null;
}
exports.blankLine = blankLine;


function getDefaultIndentation(useSpaces, tabSize) {
    if (!useSpaces) {
        return "\t";
    }
    return " ".repeat(tabSize);
}
exports.getDefaultIndentation = getDefaultIndentation;

