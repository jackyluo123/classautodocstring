"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocument = void 0;

exports.getFunctionBody = void 0;
exports.getClassBody = void 0;
exports.getFunctionDefinition = void 0;
exports.getClassDefinition = void 0;
exports.getFunctionName = void 0;
exports.getClassName = void 0;

exports.tokenizeFunctionDefinition = void 0;
exports.tokenizeClassDefinition = void 0;

exports.parseFunctionParameters = void 0;
exports.parseClassParameters = void 0;

exports.guessType = void 0;
exports.guessTypeFromValue = void 0;

exports.getDefaultIndentation = void 0;
exports.getIndentation = void 0;

exports.getDocstringIndentation = void 0;

exports.parseOldDocstring = void 0;

var parse_document_1 = require("./parse_document");
Object.defineProperty(exports, "parseDocument", { enumerable: true, get: function () { return parse_document_1.parseDocument; } });

var get_body_1 = require("./get_body");
Object.defineProperty(exports, "getFunctionBody", { enumerable: true, get: function () { return get_body_1.getFunctionBody; } });
Object.defineProperty(exports, "getClassBody", { enumerable: true, get: function () { return get_body_1.getClassBody; } });
var get_definition_1 = require("./get_definition");
Object.defineProperty(exports, "getFunctionDefinition", { enumerable: true, get: function () { return get_definition_1.getFunctionDefinition; } });
Object.defineProperty(exports, "getClassDefinition", { enumerable: true, get: function () { return get_definition_1.getClassDefinition; } });
var get_name_1 = require("./get_name");
Object.defineProperty(exports, "getFunctionName", { enumerable: true, get: function () { return get_name_1.getFunctionName; } });
Object.defineProperty(exports, "getClassName", { enumerable: true, get: function () { return get_name_1.getClassName; } });

var tokenize_definition_1 = require("./tokenize_definition");
Object.defineProperty(exports, "tokenizeFunctionDefinition", { enumerable: true, get: function () { return tokenize_definition_1.tokenizeFunctionDefinition; } });
Object.defineProperty(exports, "tokenizeClassDefinition", { enumerable: true, get: function () { return tokenize_definition_1.tokenizeClassDefinition; } });

var parse_parameters_1 = require("./parse_parameters");
Object.defineProperty(exports, "parseFunctionParameters", { enumerable: true, get: function () { return parse_parameters_1.parseFunctionParameters; } });
Object.defineProperty(exports, "parseClassParameters", { enumerable: true, get: function () { return parse_parameters_1.parseClassParameters; } });

var guess_type_1 = require("./guess_type");
Object.defineProperty(exports, "guessType", { enumerable: true, get: function () { return guess_type_1.guessType; } });
Object.defineProperty(exports, "guessTypeFromValue", { enumerable: true, get: function () { return guess_type_1.guessTypeFromValue; } });

var utilities_1 = require("./utilities");
Object.defineProperty(exports, "getDefaultIndentation", { enumerable: true, get: function () { return utilities_1.getDefaultIndentation; } });
Object.defineProperty(exports, "getIndentation", { enumerable: true, get: function () { return utilities_1.getIndentation; } });

var get_docstring_identation_1 = require("./get_docstring_indentation");
Object.defineProperty(exports, "getDocstringIndentation", { enumerable: true, get: function () { return get_docstring_identation_1.getDocstringIndentation; } });

var parse_old_docstring_1 = require("./parse_old_docstring");
Object.defineProperty(exports, "parseOldDocstring", { enumerable: true, get: function () { return parse_old_docstring_1.parseOldDocstring; } });
