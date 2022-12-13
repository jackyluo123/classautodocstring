"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDocstringParts = void 0;

const logger_1 = require("./logger");

/**
 * Function to decide which parts of the new docstring to add to the old docstring
 * @param {*} newDocstringParts New docstring created from reading the content
 * @param {*} oldDocstringParts Currently existing docstring with edits from the user
 * @returns An object containing the portions to add
 */
function compareDocstringParts(newDocstringParts, oldDocstringParts, docType = "function") {
    if (docType === "class") {
        return compareClassDocstringParts(newDocstringParts,oldDocstringParts);
    }
    return compareFunctionDocstringParts(newDocstringParts,oldDocstringParts);
}
exports.compareDocstringParts = compareDocstringParts;

function compareFunctionDocstringParts (newDocstringParts, oldDocstringParts) {
    const compareAnswer = {
        name: false,
        decorators: false,
        args: false,
        kwargs: false,
        exceptions: false,
    };

    // ********************************* Compare the name of the function
    (0, logger_1.logDebug)("    Comparing names of functions...");
    if (oldDocstringParts.name !== undefined && newDocstringParts.name !== oldDocstringParts.name) {
        compareAnswer.name = true;
        oldDocstringParts.name = newDocstringParts.name;
    }
    (0, logger_1.logDebug)("    " + compareAnswer.name);

    // ********************************** Compare the decorators
    (0, logger_1.logDebug)("    Comparing decorators...");
    const newDecorators = newDocstringParts.decorators;
    const oldDecorators = oldDocstringParts.decorators;
    const toAddDecorators = [];
    if (newDecorators.length !== 0) {
        let insertCounter = 0;
        for (let i = 0; i < newDecorators.length; i++) {
            if (!inArray(newDecorators[i].name,oldDecorators.map(a => a.name))) {
                // Since we set the conditions that the lengths are the same, we can insert without issues
                toAddDecorators.push({
                    index: i + insertCounter,
                    decorator: newDecorators[i],
                });
                insertCounter++;
                compareAnswer.decorators = true;
            }
        }
    } else if (oldDecorators.length === 0) {
        let insertCounter = 0;
        for (let i = 0; i < newDecorators.length; i++) {
            toAddDecorators.push({
                index: i + insertCounter,
                arg: newDecorators[i],
            });
            insertCounter++;
            compareAnswer.decorators = true;
        }
    }
    (0, logger_1.logDebug)("    " + compareAnswer.decorators);

    // *********************************************** Compare the function arguments
    (0, logger_1.logDebug)("    Comparing arg...");
    const newArgs = newDocstringParts.args;
    const oldArgs = oldDocstringParts.args;
    const toAddArgs = [];
    if (newArgs.length !== 0 && oldArgs.length !== 0) {
        let insertCounter = 0;
        for (let i = 0; i < newArgs.length; i++) {
            if (!inArray(newArgs[i].var,oldArgs.map(a => a.var))) {
                toAddArgs.push({
                    index: i + insertCounter,
                    arg: newArgs[i],
                });
                if (i <= oldArgs.length) {
                    
                    insertCounter++;
                }
                compareAnswer.args = true;
            }
        }
    } else if (oldArgs.length === 0) {
        // Above condition will be skipped if oldArgs was 0
        // Add everything in newArgs
        let insertCounter = 0;
        for (let i = 0; i < newArgs.length; i++) {
            toAddArgs.push({
                index: i + insertCounter,
                arg: newArgs[i],
            });
            insertCounter++;
            compareAnswer.args = true;
        }
    }
    (0, logger_1.logDebug)("    " + compareAnswer.args);

    // *********************************************** Compare the function keyword arguments
    (0, logger_1.logDebug)("    Comparing kwarg...");
    const newKwargs = newDocstringParts.kwargs;
    const oldKwargs = oldDocstringParts.kwargs;
    const toAddKwargs = [];
    if (newKwargs.length !== 0 && oldKwargs.length !== 0) {
        let insertCounter = 0;
        for (let i = 0; i < newKwargs.length; i++) {
            if (!inArray(newKwargs[i].var,oldKwargs.map(a => a.var))) {
                toAddKwargs.push({
                    index: i + insertCounter,
                    kwarg: newKwargs[i],
                });
                if (i <= oldKwargs.length) {
                    
                    insertCounter++;
                }
                compareAnswer.kwargs = true;
            }
        }
    } else if (oldKwargs.length === 0) {
        // Above condition will be skipped if oldKwargs was 0
        // Add everything in newKwargs
        let insertCounter = 0;
        for (let i = 0; i < newKwargs.length; i++) {
            toAddKwargs.push({
                index: i + insertCounter,
                kwarg: newKwargs[i],
            });
            insertCounter++;
            compareAnswer.kwargs = true;
        }
    }
    (0, logger_1.logDebug)("    " + compareAnswer.kwargs);

    // *********************************************** Compare the function exceptions
    (0, logger_1.logDebug)("    Comparing exceptions...");
    const newExceptions = newDocstringParts.exceptions;
    const oldExceptions = oldDocstringParts.exceptions;
    const toAddExceptions = [];
    if (newExceptions.length !== 0 && oldExceptions.length !== 0) {
        
        let insertCounter = 0;
        for (let i = 0; i < newExceptions.length; i++) {
            if (!inArray(newExceptions[i].var,oldExceptions.map(a => a.var))) {
                toAddExceptions.push({
                    index: i + insertCounter,
                    exception: newExceptions[i],
                });
                if (i <= oldExceptions.length) {
                    
                    insertCounter++;
                }
                compareAnswer.exceptions = true;
            }
        }
    } else if (oldExceptions.length === 0) {
        let insertCounter = 0;
        for (let i = 0; i < newExceptions.length; i++) {
            toAddExceptions.push({
                index: i + insertCounter,
                exceptions: newExceptions[i],
            });
            insertCounter++;
            compareAnswer.exceptions = true;
        }
    }
    (0, logger_1.logDebug)("    " + compareAnswer.exceptions);

    return {
        decorators: toAddDecorators,
        args: toAddArgs,
        kwargs: toAddKwargs,
        exceptions: toAddExceptions,
    };
}


function compareClassDocstringParts (newDocstringParts, oldDocstringParts) {
    const compareAnswer = {
        name: false,
        decorators: false,
        args: false,
        attributes: false,
        exceptions: false,
    };
    
    // ********************************* Compare the name of the class
    (0, logger_1.logDebug)("    Comparing names of classes...");
    if (oldDocstringParts.name !== undefined && newDocstringParts.name !== oldDocstringParts.name) {
        compareAnswer.name = true;
        oldDocstringParts.name = newDocstringParts.name;
    }
    (0, logger_1.logDebug)("    " + compareAnswer.name);

    // ********************************** Compare the decorators
    (0, logger_1.logDebug)("    Comparing decorators...");
    const newDecorators = newDocstringParts.decorators;
    const oldDecorators = oldDocstringParts.decorators;
    const toAddDecorators = [];
    // if (newDecorators.length === oldDecorators.length) {
    if (newDecorators.length !== 0) {
        let insertCounter = 0;
        for (let i = 0; i < newDecorators.length; i++) {
            if (!inArray(newDecorators[i].name,oldDecorators.map(a => a.name))) {
                // Since we set the conditions that the lengths are the same, we can insert without issues
                //oldDocstringParts.decorators.splice(i + insertCounter,0,newDecorators[i]);
                toAddDecorators.push({
                    index: i + insertCounter,
                    decorator: newDecorators[i],
                });
                insertCounter++;
                compareAnswer.decorators = true;
            }
        }

        // Legacy content
        // for (const decorator of newDecorators) {
        //     if (!inArray(decorator,oldDecorators)) {
        //         compareAnswer.decorators = true;
        //         break;
        //     }
        // }
    } else if (oldDecorators.length === 0) {
        let insertCounter = 0;
        for (let i = 0; i < newDecorators.length; i++) {
            toAddDecorators.push({
                index: i + insertCounter,
                decorator: newDecorators[i],
            });
            insertCounter++;
            compareAnswer.decorators = true;
        }
    }
    // } else {
    //     compareAnswer.decorators = true;
    // }
    (0, logger_1.logDebug)("    " + compareAnswer.decorators);

    // ************************************ Compare the arguments (inheritence)
    // This comparison is if the current parsing has elements that are not found in the old docstring
    // This is because the user may have added their own elements that the parsing failed to find in a previous autodocstring
    (0, logger_1.logDebug)("    Comparing args...");
    const newArgs = newDocstringParts.args;
    const oldArgs = oldDocstringParts.args;
    const toAddArgs = [];
    // if (newArgs.length === oldArgs.length) {
    if (newArgs.length !== 0 && oldArgs.length !== 0) {
        let insertCounter = 0;
        for (let i = 0; i < newArgs.length; i++) {
            // Cannot compare arrays consisting of objects, so map the names to an array
            if (!inArray(newArgs[i].var,oldArgs.map(a => a.var))) {
                // oldDocstringParts.args.splice(i + insertCounter,0,newArgs[i]);
                toAddArgs.push({
                    index: i + insertCounter,
                    arg: newArgs[i],
                });
                insertCounter++;
                compareAnswer.args = true;
            }
        }
        // Legacy content
        // var found = false;
        // for (let i = 0; i < newArgs.length; i++) {
        //     found = false;
        //     for (let j = 0; j < oldArgs.length; j++) {
        //         if (newArgs.args[i].var === oldDocstringParts.args[j].var) {
        //             found = true;
        //             break;
        //         }
        //     }
        //     if (found === false) {
        //         compareAnswer.args = true;
        //         break;
        //     }
        // }
    } else if (oldArgs.length === 0) {
        let insertCounter = 0;
        for (let i = 0; i < newArgs.length; i++) {
            toAddArgs.push({
                index: i + insertCounter,
                arg: newArgs[i],
            });
            insertCounter++;
            compareAnswer.args = true;
        }
    }

    // } else {
    //     compareAnswer.args = true;
    // }
    (0, logger_1.logDebug)("    " + compareAnswer.args);

    // *********************************************** Compare the class attributes
    (0, logger_1.logDebug)("    Comparing attributes...");
    const newAttributes = newDocstringParts.attributes;
    const oldAttributes = oldDocstringParts.attributes;
    const toAddAttributes = [];
    //if (newAttributes.length === oldAttributes.length) {
    if (newAttributes.length !== 0 && oldAttributes.length !== 0) {
        
        let insertCounter = 0;
        for (let i = 0; i < newAttributes.length; i++) {
            if (!inArray(newAttributes[i].var,oldAttributes.map(a => a.var))) {
                //oldDocstringParts.attributes.splice(i + insertCounter,0,newAttributes[i]);
                toAddAttributes.push({
                    index: i + insertCounter,
                    attribute: newAttributes[i],
                });
                if (i <= oldAttributes.length) {
                    
                    insertCounter++;
                }
                compareAnswer.attributes = true;
            }
        }

        // Legacy
        // var found = false;
        // for (let i = 0; i < newAttributes.length; i++) {
        //     found = false;
        //     for (let j = 0; j < oldAttributes.length; j++) {
        //         if (newAttributes[i].name === oldAttributes[j].name) {
        //             found = true;
        //             break;
        //         }
        //     }
        //     if (found === false) {
        //         compareAnswer.attributes = true;
        //         break;
        //     }
        // }
    } else if (oldAttributes.length === 0) {
        // Above condition will be skipped if oldAttributes was 0
        // Add everything in newAttributes
        let insertCounter = 0;
        for (let i = 0; i < newAttributes.length; i++) {
            toAddAttributes.push({
                index: i + insertCounter,
                attribute: newAttributes[i],
            });
            insertCounter++;
            compareAnswer.attributes = true;
        }
    }
    
    //} else {
    //    compareAnswer.attributes = true;
    //}
    (0, logger_1.logDebug)("    " + compareAnswer.attributes);

    // *********************************************** Compare the class exceptions
    (0, logger_1.logDebug)("    Comparing exceptions...");
    const newExceptions = newDocstringParts.exceptions;
    const oldExceptions = oldDocstringParts.exceptions;
    const toAddExceptions = [];
    //if (newAttributes.length === oldAttributes.length) {
    if (newExceptions.length !== 0 && oldExceptions.length !== 0) {
        
        let insertCounter = 0;
        for (let i = 0; i < newExceptions.length; i++) {
            if (!inArray(newExceptions[i].var,oldExceptions.map(a => a.var))) {
                toAddExceptions.push({
                    index: i + insertCounter,
                    exception: newExceptions[i],
                });
                if (i <= oldExceptions.length) {
                    
                    insertCounter++;
                }
                compareAnswer.exceptions = true;
            }
        }

    } else if (oldExceptions.length === 0) {
        let insertCounter = 0;
        for (let i = 0; i < newExceptions.length; i++) {
            toAddExceptions.push({
                index: i + insertCounter,
                exceptions: newExceptions[i],
            });
            insertCounter++;
            compareAnswer.exceptions = true;
        }
    }

    (0, logger_1.logDebug)("    " + compareAnswer.exceptions);


    //return compareAnswer;
    //return oldDocstringParts;
    return {
        decorators: toAddDecorators,
        args: toAddArgs,
        attributes: toAddAttributes,
        exceptions: toAddExceptions,
    };
}

function inArray(item, array) {
    return array.some((x) => item === x);
}
exports.inArray = inArray;