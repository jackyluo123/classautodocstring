"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.docstringIsClosed = void 0;
exports.validDocstringPrefix = void 0;
exports.validClassPrecedingLine = void 0;
exports.validFunctionPrecedingLine = void 0;
exports.validExistingDocstring = void 0;
exports.wasFunctionDocstring = void 0;
exports.wasClassDocstring = void 0;

var docstring_is_closed_1 = require("./docstring_is_closed");
Object.defineProperty(exports, "docstringIsClosed", { enumerable: true, get: function () { return docstring_is_closed_1.docstringIsClosed; } });
var valid_docstring_prefix_1 = require("./valid_docstring_prefix");
Object.defineProperty(exports, "validDocstringPrefix", {enumerable: true, get: function () { return valid_docstring_prefix_1.validDocstringPrefix; } });
var valid_preceding_line_1 = require("./valid_preceding_line");
Object.defineProperty(exports, "validClassPrecedingLine", {enumerable: true, get: function () { return valid_preceding_line_1.validClassPrecedingLine; } });
Object.defineProperty(exports, "validFunctionPrecedingLine", {enumerable: true, get: function () { return valid_preceding_line_1.validFunctionPrecedingLine; } });
var valid_existing_docstring_1 = require("./valid_existing_docstring");
Object.defineProperty(exports, "validExistingDocstring", {enumerable: true, get: function () { return valid_existing_docstring_1.validExistingDocstring; } });
var was_docstring_1 = require("./wasDocstring");
Object.defineProperty(exports, "wasFunctionDocstring", {enumerable: true, get: function () { return was_docstring_1.wasFunctionDocstring; } });
Object.defineProperty(exports, "wasClassDocstring", {enumerable: true, get: function () { return was_docstring_1.wasClassDocstring; } });