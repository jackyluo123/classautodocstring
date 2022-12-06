"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;

const ts_dedent_1 = require("ts-dedent");

function docstringPartsToString(docstringParts){
    var _a, _b, _c, _d;
    const decoratorsText = docstringParts.decorators.length
        ? docstringParts.decorators.map((decorator) => `${decorator.name}`).join("\n")
        : "N/A";
    const argsText = docstringParts.args.length
        ? docstringParts.args.map((argument) => `${argument.var} ${argument.type}`).join("\n")
        : "N/A";
    const exceptionsText = docstringParts.exceptions.length
        ? docstringParts.exceptions.map((exception) => `${exception.type}`).join("\n")
        : "N/A";
    return (0, ts_dedent_1.default) `
    Docstring parts:
        Name:
            ${docstringParts.name}
        Decorators:
            ${decoratorsText}
        Args:
            ${argsText}
        Exceptions:
            ${exceptionsText}
    `;
}
exports.docstringPartsToString = docstringPartsToString;