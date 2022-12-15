"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionBody = void 0;
const utilities_1 = require("./utilities");
const logger_1 = require("../logger");

function getFunctionBody(document, linePosition){
    const lines = document.split("\n");
    const body = [];
    let currentLineNum = linePosition+1;
    const originalIndentation = getFunctionBodyBaseIndentation(lines, linePosition);
    (0, logger_1.logDebug)("    Function Body indentation: " + originalIndentation.toString());

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];
        if ((0, utilities_1.blankLine)(line)) {
            currentLineNum++;
            continue;
        }
        if ((0, utilities_1.indentationOf)(line) < originalIndentation) {
            break;
        }
        (0, logger_1.logDebug)("    Line added to function body:" + line.toString());
        body.push(line);
        currentLineNum++;
    }

    return (0, utilities_1.preprocessLines)(body);
}
exports.getFunctionBody = getFunctionBody;

exports.getClassBody = void 0;
function getClassBody(document, linePosition){
    const lines = document.split("\n");
    const body = [];
    let currentLineNum = linePosition+1;
    const originalIndentation = getClassBodyBaseIndentation(lines, linePosition);
    (0, logger_1.logDebug)("    Class Body indentation: " + originalIndentation.toString());

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];
        if ((0, utilities_1.blankLine)(line)) {
            currentLineNum++;
            continue;
        }
        if ((0, utilities_1.indentationOf)(line) < originalIndentation) {
            break;
        }
        (0, logger_1.logDebug)("    Line added to class body:" + line.toString());
        body.push(line);
        currentLineNum++;
    }

    return (0, utilities_1.preprocessLines)(body);
}
exports.getClassBody = getClassBody;


function getFunctionBodyBaseIndentation(lines, linePosition) {
    let currentLineNum = linePosition;
    const functionDefRegex = /\s*def \w+/; // Maybe change to include "class" or maybe even replace "def"
    // search downward until we reach a non-blank line or the next function defintion
    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];
        if ((0, utilities_1.blankLine)(line)) {
            currentLineNum++;
            continue;
        }
        if (functionDefRegex.test(line)) {
            break;
        }
        return (0, utilities_1.indentationOf)(line);
    }
    return 10000;
}
function getClassBodyBaseIndentation(lines, linePosition) {
    let currentLineNum = linePosition;
    // \s* means that 0 or more spaces before "class "
    // \w is alnum char
    const functionDefRegex = /\s*class \w+/;
    // search downward until we reach a non-blank line or the next function defintion
    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];
        if ((0, utilities_1.blankLine)(line)) {
            currentLineNum++;
            continue;
        }
        if (functionDefRegex.test(line)) {
            break;
        }
        return (0, utilities_1.indentationOf)(line);
    }
    return 10000;
}