"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validExistingDocstring = void 0;

// This it for updating the docstring
function validExistingDocstring(documentText, linePosition, quoteStyle) {
    // search upwards
    if (documentText[linePosition].trimStart().indexOf(quoteStyle) !== 0 || linePosition === 0) {
        return false;
    }
    // use + instead of * because there should always be at least one space
    const indendationPattern = /\s+/;
    const indendationMatches = indendationPattern.exec(documentText[linePosition]);
    if (indendationMatches === null || indendationMatches === undefined || indendationMatches[0] === null || indendationMatches[0] === undefined) {
        return false; // somethin went wrong with the indendation
    }
    const indendation = indendationMatches[0];
    for (let i = linePosition - 1; i >= 0; i--) {
        if (documentText[linePosition].trimStart().indexOf(quoteStyle) === 0) {
            // found the start of the comment block
            matches = indendationPattern.exec(documentText[i]);
            if (matches === null || matches === undefined || matches[0] === null || matches[0] === undefined) {
                return false;
            }
            // If the indendation at the top is not the same as the bottom, terminate
            if (matches[0] !== indendation) {
                return false;
            }
            return true;
        }
    }
    return false;
}
exports.validExistingDocstring = validExistingDocstring;

