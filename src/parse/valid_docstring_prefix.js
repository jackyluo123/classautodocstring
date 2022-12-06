"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;

function validDocstringPrefix(document, linePosition, charPosition, quoteStyle) {
    const lines = document.split(/\r?\n/);
    const line = lines[linePosition];
    const prefix = line.slice(0, charPosition + 1);
    const regex = RegExp("^[^\\S\\r]*" + quoteStyle + "$");
    return regex.test(line) && regex.test(prefix);
}

exports.validDocstringPrefix = validDocstringPrefix;