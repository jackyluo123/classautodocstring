"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validExistingDocstring = void 0;

// This it for updating the docstring
function validExistingDocstring(documentText, linePosition, quoteStyle, prefixStyle) {
    // search upwards
    const lines = documentText.split("\n");
    if (lines[linePosition].trimStart().indexOf(quoteStyle+prefixStyle) !== 0 || linePosition === 0) {
        return false;
    }
    // use + instead of * because there should always be at least one space
    const indendationPattern = /\s+/;
    const indendationMatches = indendationPattern.exec(lines[linePosition]);
    if (indendationMatches === null || indendationMatches === undefined || indendationMatches[0] === null || indendationMatches[0] === undefined) {
        return false; // something went wrong with the indendation
    }
    const indendation = indendationMatches[0];
    for (let i = linePosition - 2; i >= 0; i--) {
        if (lines[i].trimStart().indexOf(quoteStyle) === 0) {
            // found the start of the comment block
            const matches = indendationPattern.exec(lines[i]);
            if (matches === null || matches === undefined || matches[0] === null || matches[0] === undefined) {
                return false;
            }
            // If the indendation at the top is not the same as the bottom, terminate
            if (matches[0] !== indendation) {
                return false;
            }
            return true;
        } else if (lines[i].trimStart().indexOf("def ") === 0 || lines[i].trimStart().indexOf("class ") === 0) {
            // We found the class or function definition, which means the search failed, don't keep going
            return false;
        }
    }
    return false;
}
exports.validExistingDocstring = validExistingDocstring;

