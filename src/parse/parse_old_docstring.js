"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOldDocstring = void 0;

function parseOldDocstring(document, positionLine) {
    // Assumes the user input the update command on the last line of the comment block
    const body = getCommentBlock(document, positionLine);

    // Need to parse the body into useful data for docstringparts
    const attributes = getCommentAttributes(body);
    const args = getCommentArguments(body);
    const exceptions = getCommentExceptions(body);
    return {
        args: args,
        attributes: attributes,
        exceptions: exceptions
    };
}

/**
 * REQUIRES THE USER TO INPUT UPDATE COMMAND ON THE LAST LINE OF THE COMMENT BLOCK
 * @param {*} document 
 * @param {*} positionLine 
 * @returns 
 */
function getCommentBlock(document, positionLine) {
    const lines = document.split("\n");
    const quoteStyle = lines[positionLine].trimEnd();
    for (let i = positionLine; i >= 0; i--) {
        if (lines[i].includes(quoteStyle)) {
            // Found the upper end of the comment block
            const commentBlockLines = lines.slice(i, positionLine+1); // +1 for slicing indexing
            break;
        }
    }
    return commentBlockLines;
}

function getCommentAttributes(lines) {
    var foundAttributes = false;
    const attributes = [];
    const varNamePattern = /\s*(\w*)\s/;
    const varTypePattern = /\s\(([\w,'"]*)\):/;
    for (var line of lines) {
        // Not fond of this. Instead of "Attributes:", there should be a way of getting the template format
        // That can be done in a future update since format is not too important
        if (line.includes("Attributes:")) {
            // Found our starting line for attributes
            foundAttributes = true;
        } else if ((0, utilities_1.blankLine)(line)) {
            foundAttributes = false;
        }

        if (foundAttributes === true) {
            var nameMatch = varNamePattern.exec(line);
            var typeMatch = varTypePattern.exec(line);
            attributes.push({
                var: nameMatch[1],
                type: typeMatch[1]
            });
        }
    }
}

function getCommentArguments(lines) {
    var foundArgs = false;
    const args = [];
    const varNamePattern = /\s*(\w*)\s/;
    for (var line of lines) {
        if (line.includes("Inherits:")) {
            foundArgs = true;
        } else if ((0, utilities_1.blankLine)(line)) {
            foundArgs = false;
        }

        if (foundArgs === true) {
            var nameMatch = varNamePattern.exec(line);
            args.push(nameMatch[1]);
        }
    }
}

function getCommentExceptions(lines) {
    var foundExceptions = false;
    const exceptions = [];
    const varNamePattern = /\s*(\w*):/;
    for (var line of lines) {
        if (line.includes("Raises:")) {
            foundExceptions = true;
        } else if ((0, utilities_1.blankLine)(line)) {
            foundExceptions = false;
        }

        if (foundExceptions === true) {
            var nameMatch = varNamePattern.exec(line);
            exceptions.push(nameMatch[1]);
        }
    }
}

exports.parseOldDocstring = parseOldDocstring;