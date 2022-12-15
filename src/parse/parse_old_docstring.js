"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOldDocstring = void 0;

const logger_1 = require("../logger");
const utilities_1 = require("./utilities");

function parseOldDocstring(document, positionLine, docType = "function") {
    if (docType === "class") {
        (0, logger_1.logDebug)("    Getting comment block...");
        // Assumes the user input the update command on the last line of the comment block
        const body = getCommentBlock(document, positionLine);
        (0, logger_1.logDebug)("    Got comment block: ");
        (0, logger_1.logDebug)("\n" + body);
        // Need to parse the body into useful data for docstringparts
        
        (0, logger_1.logDebug)("    Getting comment attributes...");
        const attributes = getCommentAttributes(body);
        (0, logger_1.logDebug)("    Got comment attributes: " + attributes.map(a => a.var));

        (0, logger_1.logDebug)("    Getting comment methods...");
        const functions = getCommentClassFunctions(body);
        (0, logger_1.logDebug)("    Got comment methods: " + functions.map(a => a.name));

        (0, logger_1.logDebug)("    Getting comment arguments...");
        const args = getCommentClassArguments(body);
        (0, logger_1.logDebug)("    Got comment arguments: " + args.map(a => a.var));

        (0, logger_1.logDebug)("    Getting comment exceptions...");
        const exceptions = getCommentExceptions(body);
        (0, logger_1.logDebug)("    Got comment exceptions:" + exceptions);
        
        return {
            name: undefined,
            args: args,
            decorators: [],
            functions: functions,
            attributes: attributes,
            exceptions: exceptions,
        };
    }
    if (docType === "function") {
        (0, logger_1.logDebug)("    Getting comment block...");
        // Assumes the user input the update command on the last line of the comment block
        const body = getCommentBlock(document, positionLine);
        (0, logger_1.logDebug)("    Got comment block: ");
        (0, logger_1.logDebug)("\n" + body);

        (0, logger_1.logDebug)("    Getting comment arguments...");
        const args = getCommentFunctionArguments(body);
        (0, logger_1.logDebug)("    Got comment arguments: " + args.map(a => a.var));

        (0, logger_1.logDebug)("    Getting comment keyword arguments...");
        const kwargs = getCommentFunctionKeywordArguments(body);
        (0, logger_1.logDebug)("    Got comment arguments: " + kwargs.map(a => a.var));

        (0, logger_1.logDebug)("    Getting comment exceptions...");
        const exceptions = getCommentExceptions(body);
        (0, logger_1.logDebug)("    Got comment exceptions:" + exceptions);
        return {
            name: undefined,
            args: args,
            kwargs: kwargs,
            decorators: [],
            exceptions: exceptions
        };
    }
    return undefined;
}
exports.parseOldDocstring = parseOldDocstring;

/**
 * REQUIRES THE USER TO INPUT UPDATE COMMAND ON THE LAST LINE OF THE COMMENT BLOCK
 * @param {*} document 
 * @param {*} positionLine 
 * @returns 
 */
function getCommentBlock(document, positionLine) {
    const lines = document.split("\n");
    const quoteStyle = lines[positionLine].trim(); // THIS MAY FAIL WHEN INCLUDING PREFIX
    for (let i = positionLine-1; i >= 0; i--) {
        if (lines[i].includes(quoteStyle)) {
            // Found the upper end of the comment block
            const commentBlockLines = lines.slice(i, positionLine+1); // +1 for slicing indexing
            return commentBlockLines;
        }
    }
    return [];
}

function getCommentAttributes(lines) {
    let foundAttributes = false;
    const attributes = [];
    const varNamePattern = /\s*(\w*)\s/;
    const varTypePattern = /\s\(([\w,'"]*)\):/;
    for (var line of lines) {
        // Not fond of this. Instead of "Attributes:", there should be a way of getting the template format
        // That can be done in a future update since format is not too important
        if (line.includes("Attributes:")) {
            // Found our starting line for attributes
            foundAttributes = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line)|| 
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            // Keep recording attributes until we reach a blank line
            foundAttributes = false;
        } else if (!line.includes(":")) {
            continue; // Existing description may be over several lines
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
    return attributes;
}

function getCommentClassFunctions(lines) {
    let foundFunctions = false;
    const functions = [];
    const functNamePattern = /\s*(\w*)/;
    for (var line of lines) {
        if (line.includes("Methods:")) {
            foundFunctions = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line) ||
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            // Just in case we went past the comment block
            foundFunctions = false;
        } else if (!line.includes(":")) {
            continue; // Existing function descriptions may be over several lines
        }

        if (foundFunctions === true) {
            var nameMatch = functNamePattern.exec(line);
            functions.push({
                name: nameMatch[1],
            })
        }
    }
    return functions;
}

function getCommentClassArguments(lines) {
    let foundArgs = false;
    const args = [];
    const varNamePattern = /\s*(\w*)/;
    for (var line of lines) {
        if (line.includes("Inherits:")) {
            foundArgs = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line)|| 
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            foundArgs = false;
        } else if (!line.includes(":")) {
            continue; // Existing description may be over several lines
        }

        if (foundArgs === true) {
            var nameMatch = varNamePattern.exec(line);
            args.push({
                var: nameMatch[1]
            });
        }
    }
    return args;
}

function getCommentExceptions(lines) {
    let foundExceptions = false;
    const exceptions = [];
    const varNamePattern = /\s*(\w*):/;
    for (var line of lines) {
        if (line.includes("Raises:")) {
            foundExceptions = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line)|| 
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            foundExceptions = false;
        } else if (!line.includes(":")) {
            continue; // Existing description may be over several lines
        }

        if (foundExceptions === true) {
            var nameMatch = varNamePattern.exec(line);
            exceptions.push({
                type: nameMatch[1],
            });
        }
    }
    return exceptions;
}

function getCommentFunctionArguments (lines) {
    let foundArgs = false;
    const args = [];
    const varNamePattern = /\s*(\w*)\s/;
    const varTypePattern = /\s\(([\w,'"]*)\):/;
    for (var line of lines) {
        if (line.includes("Args:")) {
            // Found our starting line for attributes
            foundArgs = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line)|| 
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            foundArgs = false;
        } else if (!line.includes(":") || line.includes(", optional")) {
            // Don't record kwargs as args
            continue; // Existing description may be over several lines
        }

        if (foundArgs === true) {
            var nameMatch = varNamePattern.exec(line);
            var typeMatch = varTypePattern.exec(line);
            args.push({
                var: nameMatch[1],
                type: typeMatch[1]
            });
        }
    }
    return args;
}

function getCommentFunctionKeywordArguments (lines) {
    let foundKwargs = false;
    const kwargs = [];
    const varNamePattern = /\s*(\w*)\s/;
    const varTypePattern = /\s\(([\w,'"]*), optional\):/;
    for (var line of lines) {
        if (line.includes("Args:")) {
            // Found our starting line for attributes
            foundKwargs = true;
            continue;
        } else if ((0, utilities_1.blankLine)(line) || 
        line.trim().indexOf("def ") === 0 || 
        line.trim().indexOf("class ") === 0) {
            // We finished with reading by reading a blank line or a class/funct definition
            foundKwargs = false;
        } else if (!line.includes(", optional):")) {
            // Don't record args as kwargs
            continue; // Existing description may be over several lines
        }

        if (foundKwargs === true) {
            var nameMatch = varNamePattern.exec(line);
            var typeMatch = varTypePattern.exec(line);
            kwargs.push({
                var: nameMatch[1],
                type: typeMatch[1]
            });
        }
    }
    return kwargs;
}