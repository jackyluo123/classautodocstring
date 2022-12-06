"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFunctionParameters = void 0;
exports.parseClassParameters = void 0;

const { isMapIterator } = require("util/types");
const _1 = require(".");
const logger_1 = require("../logger");

function parseFunctionParameters(parameterTokens, body, functionName) {
    const decorators = parseDecorators(parameterTokens);
    const args = parseArguments(parameterTokens);
    const kwargs = parseKeywordArguments(parameterTokens);
    const returns = parseReturns(parameterTokens, body);
    const exceptions = parseExceptions(body);
    (0, logger_1.logDebug)("    name: ");
    (0, logger_1.logDebug)("    " + functionName);
    (0, logger_1.logDebug)("    decorators: ");
    for (const decorator of decorators) {(0, logger_1.logDebug)("        " + decorator.name);}
    (0, logger_1.logDebug)("    args: ");
    for (const arg of args) {(0, logger_1.logDebug)("        " + arg.var + ":" + arg.type);}
    (0, logger_1.logDebug)("    kwargs: ");
    for (const kwarg of kwargs) {(0, logger_1.logDebug)("       " + kwarg.var + ":" + kwarg.type);}
    (0, logger_1.logDebug)("    returns: ");
    (0, logger_1.logDebug)("       " + returns.type);
    // (0, logger_1.logDebug)("    yields: ");
    // for (const yield of parseYields(parameterTokens, body)) {(0, logger_1.logDebug)("       " + yield);}
    (0, logger_1.logDebug)("    exceptions: ");
    for (const exception of parseExceptions(body)) {(0, logger_1.logDebug)("        " + exception);}
    return {
        name: functionName,
        decorators: decorators,
        args: args,
        kwargs: kwargs,
        returns: returns,
        //yields: parseYields(parameterTokens, body),
        yields: undefined,
        exceptions: exceptions
    };
}
exports.parseFunctionParameters = parseFunctionParameters;

function parseClassParameters(parameterTokens, body, className) {
    return {
        name: className,
        decorators: parseDecorators(parameterTokens),
        args: parseArguments(parameterTokens),
        attributes: parseAttributes(body),
        exceptions: parseExceptions(body),
    };
}
exports.parseClassParameters = parseClassParameters;

function parseAttributes(body) {
    const attributes = [];
    const keywords = ["self.", "cls."];
    // match a pattern of "word.word = "
    const patternVar = /(\w+.\w+)\s?=\s?/;
    for (const line of body) {
        //const matchVar = line.match(patternVar);
        const matchVar = patternVar.exec(line);
        // If the match failed or does not include the keywords, skip this line
        if (matchVar === null || matchVar === undefined) {
            continue;
        }
        for (var keyword of keywords) {
            if (!inArray(keyword,keywords)) {
                continue;
            }
        }
        var varName = matchVar[1].slice(matchVar[1].search(/\./)+1);
        var val = line.slice(line.search("=")+1).trim(); // +1 to not include the =
        attributes.push({
            var: varName,
            type: (0, _1.guessType)(val),
        });
    }
    return attributes;
}

function parseDecorators(parameters) {
    const decorators = [];
    const pattern = /^@(\w+)/;
    for (const param of parameters) {
        const match = param.trim().match(pattern);
        if (match === null || match === undefined) {
            continue;
        }
        decorators.push({
            name: match[1],
        });
    }
    return decorators;
}

function parseArguments(parameters) {
    const args = [];
    const excludedArgs = ["self", "cls"];
    const pattern = /^(\w+)/;
    for (const param of parameters) {
        const match = param.trim().match(pattern);
        if (match === null || param.includes("=") || inArray(param,excludedArgs)) {
            continue;
        }
        args.push({
            var: match[1],
            type: (0, _1.guessType)(param)
        });
    }
    return args;
}

function parseKeywordArguments(parameters) {
    const kwargs = [];
    const pattern = /^(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/;
    for (const param of parameters) {
        const match = param.trim().match(pattern);
        if (match === null || match === undefined) {
            continue;
        }
        kwargs.push({
            var: match[1],
            default: match[2],
            type: (0, _1.guessType)(param)
        });
    }
    return kwargs;
}

function parseReturns(parameters, body) {
    const returnType = parseReturnFromDefinition(parameters);
    if (returnType === null || isIterator(returnType.type)) {
        return parseFromBody(body, /return /);
    }
    return returnType;
}

function parseReturnFromDefinition(parameters) {
    const pattern = /^->\s*(["']?)(['"\w\[\], |\.]*)\1/;
    for (const param of parameters) {
        const match = param.trim().match(pattern);
        if (match === null || match === undefined) {
            continue;
        }
        return match[2] === "None" ? null : { type: match[2] };
    }
    return null;
}

function parseExceptions(body) {
    const exceptions = [];
    const pattern = /(?<!#.*)raise\s+([\w.]+)/;
    for (const line of body) {
        const match = line.match(pattern);
        if (match === null || match === undefined) {
            continue;
        }
        exceptions.push({ type: match[1] });
    }
    return exceptions;
}

// UTILITY FUNCTIONS BELOW

function parseFromBody(body, pattern) {
    for (const line of body) {
        const match = line.match(pattern);
        if (match === null || match === undefined) {
            continue;
        }
        return { type: undefined };
    }
    return undefined;
}

function inArray(item, array) {
    return array.some((x) => item === x);
}
exports.inArray = inArray;

function isIterator(type) {
    return type.startsWith("Generator") || type.startsWith("Iterator");
}