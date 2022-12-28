"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFunctionParameters = void 0;
exports.parseClassParameters = void 0;

const _1 = require(".");
const logger_1 = require("../logger");

function parseFunctionParameters(parameterTokens, body, functionName) {

    (0, logger_1.logDebug)("    name: ");
    (0, logger_1.logDebug)("    " + functionName);

    const decorators = parseDecorators(parameterTokens);
    (0, logger_1.logDebug)("    decorators: ");
    for (const decorator of decorators) {(0, logger_1.logDebug)("        " + decorator.name);}

    const args = parseFunctionArguments(parameterTokens);
    (0, logger_1.logDebug)("    args: ");
    for (const arg of args) {(0, logger_1.logDebug)("        " + arg.var + ":" + arg.type);}

    const kwargs = parseKeywordArguments(parameterTokens);
    (0, logger_1.logDebug)("    kwargs: ");
    for (const kwarg of kwargs) {(0, logger_1.logDebug)("       " + kwarg.var + ":" + kwarg.type);}

    const returns = parseReturns(parameterTokens, body);
    (0, logger_1.logDebug)("    returns: ");
    if (returns !== undefined && returns !== null){
        (0, logger_1.logDebug)("       " + returns.type);
    }

    const yields = parseYields(parameterTokens,body); // Returns undefined
    // (0, logger_1.logDebug)("    yields: ");
    // for (const _yield of yields) {(0, logger_1.logDebug)("       " + _yield);}

    const exceptions = parseExceptions(body);
    (0, logger_1.logDebug)("    exceptions: ");
    for (const exception of exceptions) {(0, logger_1.logDebug)("        " + exception.type);}
    
    const name = functionName === "__init__" ? "Constructor" : functionName ;
    return {
        name: name,
        decorators: decorators,
        args: args,
        kwargs: kwargs,
        returns: returns,
        yields: yields,
        exceptions: exceptions
    };
}
exports.parseFunctionParameters = parseFunctionParameters;

function parseClassParameters(parameterTokens, body, className) {
    (0, logger_1.logDebug)("    name: ");
    (0, logger_1.logDebug)("    " + className);

    const decorators = parseDecorators(parameterTokens);
    (0, logger_1.logDebug)("    decorators: ");
    for (const decorator of decorators) {(0, logger_1.logDebug)("        " + decorator.name);}

    const args = parseClassArguments(parameterTokens);
    (0, logger_1.logDebug)("    args: ");
    for (const arg of args) {(0, logger_1.logDebug)("        " + arg.var);}

    const functions = parseFunctionNames(body);
    (0, logger_1.logDebug)("    functions: ");
    for (const funct of functions) {(0, logger_1.logDebug)("        " + funct.name);}

    const attributes = parseAttributes(body, className);
    (0, logger_1.logDebug)("    attributes: ");
    for (const attr of attributes) {(0, logger_1.logDebug)("        " + attr.var + ":" + attr.type);}

    const exceptions = parseExceptions(body);
    (0, logger_1.logDebug)("    exceptions: ");
    for (const exception of exceptions) {(0, logger_1.logDebug)("        " + exception.type);}

    return {
        name: className,
        decorators: decorators,
        functions: functions,
        args: args,
        attributes: attributes,
        exceptions: exceptions,
    };
}
exports.parseClassParameters = parseClassParameters;

function parseAttributes(body, className = "") {
    const attributes = [];
    const keywords = ["self.", "cls."];
    if (className !== "") {keywords.push(className + ".");}
    // match a pattern of "word.word = ". Do not match ==
    const patternVar = /(\w+.\w+)\s?=\s?[^=]/;
    for (const line of body) {
        const matchVar = patternVar.exec(line);

        // If the match failed or does not include the keywords, skip this line
        if (matchVar === null || matchVar === undefined) {
            continue;
        }
        var keyword = matchVar[1].slice(0,matchVar[1].search(/\./)+1);
        if (!inArray(keyword,keywords)) {
            continue;
        }

        var varName = matchVar[1].slice(matchVar[1].search(/\./)+1);
        var val = line.slice(line.search("=")+1).trim(); // +1 to not include the =
        const attr = {
            var: varName,
            type: (0, _1.guessTypeFromValue)(val),
        };
        // Only push new unique attributes
        if (!inArray(attr.var,attributes.map(x => x.var))) {
            attributes.push(attr);
        }
    }
    return attributes;
}

/**
 * For grabbing function names from a class body
 * @param {*} body class body
 */
function parseFunctionNames(body) {
    const functions = [];
    const pattern = /\b((async\s+)?\s*def)\b/;
    const patternName = /\s*def\s(\w+)/;
    for (const line of body) {
        if (patternName.test(line)) {
            var name = line.match(patternName)[1];
            if (name === "__init__") {
                name = "Constructor";
            }
            // Do not need to worry about duplicate names since it would be illegal in Python anyways
            functions.push({
                name: name
            });
        }
    }
    return functions;
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

function parseFunctionArguments(parameters) {
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

function parseClassArguments(parameters) {
    const args = [];
    const excludedArgs = ["object"];
    const pattern = /^(\w+)/;
    for (const param of parameters) {
        const match = param.trim().match(pattern);
        if (match === null || param.includes("=") || inArray(param,excludedArgs)) {
            continue;
        }
        args.push({
            var: match[1]
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
    // Search failed in definition line, check the body
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

function parseYields(parameters, body) {
    // const returnType = parseReturnFromDefinition(parameters);
    // if (returnType !== null && isIterator(returnType.type)) {
    //     return returnType;
    // }
    // // To account for functions that yield but don't have a yield signature
    // const yieldType = returnType ? returnType.type : undefined;
    // const yieldInBody = parseFromBody(body, /yield /);
    // if (yieldInBody !== null && yieldType !== undefined) {
    //     yieldInBody.type = `Iterator[${yieldType}]`;
    // }
    // return yieldInBody;
    return undefined;
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