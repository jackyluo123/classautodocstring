"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareClassDocstringParts = void 0;

/**
 * Function to decide which parts of the new docstring to add to the old docstring
 * @param {*} newDocstringParts New docstring created from reading the content
 * @param {*} oldDocstringParts Currently existing docstring with edits from the user
 * @returns An object containing the portions to add
 */
function compareClassDocstringParts(newDocstringParts, oldDocstringParts) {
    const compareAnswer = {
        name: false,
        decorator: false,
        args: false,
        attributes: false
    };
    
    // Compare the name of the class
    if (newDocstringParts.name !== oldDocstringParts) {
        compareAnswer.name = true;
    }

    // Compare the decorators
    if (newDocstringParts.decorators.length === oldDocstringParts.decorators.length) {
        for (const decorator of newDocstringParts.decorators) {
            if (!inArray(decorator,oldDocstringParts.decorator)) {
                compareAnswer.decorator = true;
                break;
            }
        }
    } else {
        compareAnswer.decorator = true;
    }

    // Compare the arguments (inheritence)
    // This comparison is if the current parsing has elements that are not found in the old docstring
    // This is because the user may have added their own elements that the parsing failed to find in a previous autodocstring
    if (newDocstringParts.args.length === oldDocstringParts.args.length) {
        var found = false;
        for (let i = 0; i < newDocstringParts.args.length; i++) {
            found = false;
            for (let j = 0; j < oldDocstringParts.args.length; j++) {
                if (newDocstringParts.args[i].var === oldDocstringParts.args[j].var) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                compareAnswer.args = true;
                break;
            }
        }
        
    } else {
        compareAnswer.args = true;
    }

    // Compare the class attributes
    if (newDocstringParts.attributes.length === oldDocstringParts.attributes.length) {
        var found = false;
        for (let i = 0; i < newDocstringParts.attributes.length; i++) {
            found = false;
            for (let j = 0; j < oldDocstringParts.attributes.length; j++) {
                if (newDocstringParts.attributes[i].name === oldDocstringParts.attributes[j].name) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                compareAnswer.attributes = true;
                break;
            }
        }
        
    } else {
        compareAnswer.attributes = true;
    }

    return compareAnswer;
}
exports.compareClassDocstringParts = compareDocstringParts;