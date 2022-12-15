"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validClassPrecedingLine = void 0;
exports.validFunctionPrecedingLine = void 0;

function validClassPrecedingLine(documentText, linePosition) {
    const lines = documentText.split(/\r?\n/);
    const precedingLine = lines[linePosition - 1];
    // Make sure to check if the preceding line even exists
    if (precedingLine !== null || precedingLine !== undefined) {
        const pattern = /class /;
        return pattern.test(precedingLine);
    } 
    return false;
}exports.validClassPrecedingLine = validClassPrecedingLine;

function validFunctionPrecedingLine(documentText, linePosition) {
    const lines = documentText.split(/\r?\n/);
    const precedingLine = lines[linePosition - 1];
    // Make sure to check if the preceding line even exists
    if (precedingLine !== null || precedingLine !== undefined) {
        const pattern = /def /;
        return pattern.test(precedingLine);
    } 
    return false;
}exports.validFunctionPrecedingLine = validFunctionPrecedingLine;

