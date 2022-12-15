"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;

function wasClassDocstring(docText,linePosition) {
    const lines = docText.split("\n");
    // Look for the class definition line
    // To call this function, the comment block should have passed the checks
    // Then compare the lines needed to reach "def " or "class "
    const trackers = {
        functionFound: false,
        classFound: false
    };
    for (let i = linePosition - 1; i >= 0; i--) {
        if (lines[i].trimStart().indexOf("def ") === 0) {
            trackers.functionFound = true;
            break;
        } else if (lines[i].trimStart().indexOf("class ") === 0) {
            trackers.classFound = true;
            break;
        }
    }
    if (trackers.classFound === true && trackers.functionFound === false) {
        return true;
    } else {
        return false;
    }
}
exports.wasClassDocstring = wasClassDocstring;

function wasFunctionDocstring(docText,linePosition) {
    const lines = docText.split("\n");
    const trackers = {
        functionFound: false,
        classFound: false
    };
    for (let i = linePosition - 1; i >= 0; i--) {
        if (lines[i].trimStart().indexOf("def ") === 0) {
            trackers.functionFound = true;
            break;
        } else if (lines[i].trimStart().indexOf("class ") === 0) {
            trackers.classFound = true;
            break;
        }
    }
    if (trackers.functionFound === true && trackers.classFound === false) {
        return true;
    } else {
        return false;
    }
}
exports.wasFunctionDocstring = wasFunctionDocstring;