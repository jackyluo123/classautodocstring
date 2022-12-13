"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require("path");
const vs = require("vscode");
const fs_1 = require("fs");
const docstring_factory_1 = require("./docstring_factory");
const generate_docstring_1 = require("./generate_docstring");
const compare_docstring_parts_1 = require("./compare_docstring_parts");
const parse_1 = require("./parse/index");
const logger_1 = require("./logger");
const utilities_1 = require("./parse/utilities");
const mustache_1 = require("mustache");
const guess_types_1 = require("./parse/guess_type");

exports.UpdateAutoDocstring = class {
    constructor(editor,docType="function") {
        this.editor = editor;
        this.docType = docType;
    }
    updateDocstring() {
        if (this.editor === undefined || this.editor === null) {
            throw new Error("Cannot process this document");
        }
        const position = this.editor.selection.active;
        const docText = this.editor.document.getText();
        (0, logger_1.logDebug)("Creating new DocstringParts...");
        const newDocstringParts = (0, parse_1.parseDocument)(docText, position.line, this.docType);
        (0, logger_1.logDebug)("Created new DocstringParts!");
        
        (0, logger_1.logDebug)("Creating old DocstringParts...");
        const oldDocstringParts = (0, parse_1.parseOldDocstring)(docText,position.line,this.docType);
        (0, logger_1.logDebug)("Created old DocstringParts!");

        (0, logger_1.logDebug)("Comparing docstringparts...");
        // This compares and modifies the old docstring to include the new information
        const toAddParams = compare_docstring_parts_1.compareDocstringParts(newDocstringParts,oldDocstringParts, this.docType);
        (0, logger_1.logDebug)("Compared docstringparts!");

        (0, logger_1.logDebug)("Inserting new info...");
        if (this.docType === "class") {
            const success = this.insertNewClassInfo(toAddParams);
        } else if (this.docType === "function") {
            const success = this.insertNewFunctionInfo(toAddParams);
        }
        
        (0, logger_1.logDebug)("Finished inserting new info!");
        // success.then(() => (0, logger_1.logInfo)("Successfully updated docstring"), (reason) => {
        //     throw new Error("Could not insert docstring: " + reason.toString());
        // });
        // return success;
    }
    insertNewClassInfo (toAddParams) {
        const position = this.editor.selection.active.with(undefined, 0);
        const docText = this.editor.document.getText();
        const lines = docText.split ("\n");
        var linePosition = position.line;
        // Go upwards and find the keyword, then go downwards
        
        logger_1.logDebug ("doc string is a class");
        logger_1.logDebug ("number of args to add " + toAddParams.args.length);
        logger_1.logDebug ("number of attrs to add " + toAddParams.attributes.length);
        logger_1.logDebug ("number of decorators to add " + toAddParams.decorators.length);
        logger_1.logDebug ("number of exceptions to add " + toAddParams.exceptions.lenght);

        // **************** Attributes **************//
        if (toAddParams.attributes.length > 0) {
            logger_1.logDebug("Found attributes to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Attributes:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.attributes.length; k++) {
                                var attributeInfo = toAddParams.attributes[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassAttribute",indentation,attributeInfo.attribute);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++;
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("class ") === 0) {
                    // Did not find our line, we need to insert a new section
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Attribute header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");

                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j]) && lines[j+1].trim().indexOf("Inherits:") !== 0 && lines[j+1].trim().indexOf("Decorators:") !== 0) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Attributes:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line and blank line above it were added
                            for (let k = 0; k < toAddParams.attributes.length; k++) {
                                var attributeInfo = toAddParams.attributes[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassAttribute",indentation,attributeInfo.attribute);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        
        if (toAddParams.args.length > 0) {
            // **************** Arguments **************//
            logger_1.logDebug("Found arguments to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Inherits:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.args.length; k++) {
                                var argInfo = toAddParams.args[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassArgument",indentation,argInfo.arg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("class ") === 0) {
                    // Did not find our line, we need to insert a new section
                    // Search down till we find a blank line
                    // i + 1 because i should be the class definition line, we want the comment line underneath it
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Argument header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Inherits:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line plus blank line above it were added
                            for (let k = 0; k < toAddParams.args.length; k++) {
                                var argInfo = toAddParams.args[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassArgument",indentation,argInfo.arg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        // **************** Exceptions **************//
        if (toAddParams.exceptions.length > 0) {
            logger_1.logDebug("Found exceptions to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Raises:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.exceptions.length; k++) {
                                var exceptionInfo = toAddParams.exceptions[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassException",indentation,exceptionInfo.exception);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("class ") === 0) {
                    // Did not find our line, we need to insert a new section
                    // Search down till we find a blank line
                    // i + 1 because i should be the class definition line, we want the comment line underneath it
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Exceptions header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j]) && 
                        lines[j+1].trim().indexOf("Inherits:") !== 0 && 
                        lines[j+1].trim().indexOf("Decorators:") !== 0 &&
                        lines[j+1].trim().indexOf("Attributes:") !== 0) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Raises:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line plus blank line above it were added
                            for (let k = 0; k < toAddParams.exceptions.length; k++) {
                                var exceptionInfo = toAddParams.exceptions[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("ClassException",indentation,exceptionInfo.exception);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return undefined;
    }
    
    insertNewFunctionInfo (toAddParams) {
        const position = this.editor.selection.active.with(undefined, 0);
        const docText = this.editor.document.getText();
        const lines = docText.split ("\n");
        var linePosition = position.line;
        // Go upwards and find the keyword, then go downwards
        
        logger_1.logDebug ("doc string is a function");
        logger_1.logDebug ("number of args to add " + toAddParams.args.length);
        logger_1.logDebug ("number of kwargs to add " + toAddParams.kwargs.length);
        logger_1.logDebug ("number of decorators to add " + toAddParams.decorators.length);
        logger_1.logDebug ("number of exceptions to add " + toAddParams.exceptions.lenght);
        // Current iteration adds on new info, replacing the return should not be allowed
        // **************** args **************//
        if (toAddParams.args.length > 0) {
            logger_1.logDebug("Found args to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Args:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.args.length; k++) {
                                var argInfo = toAddParams.args[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionArgument",indentation,argInfo.arg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++;
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("def ") === 0) {
                    // Did not find our line, we need to insert a new section
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Arg header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");

                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j]) && 
                        lines[j+1].trim().indexOf("Decorators:") !== 0) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Arguments:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line and blank line above it were added
                            for (let k = 0; k < toAddParams.args.length; k++) {
                                var argInfo = toAddParams.args[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionArgument",indentation,argInfo.arg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        
        if (toAddParams.kwargs.length > 0) {
            // **************** Keyword Arguments **************//
            logger_1.logDebug("Found arguments to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Args:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.kwargs.length; k++) {
                                var kwargInfo = toAddParams.kwargs[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionKeywordArgument",indentation,kwargInfo.kwarg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("def ") === 0) {
                    // Did not find our line, we need to insert a new section
                    // Search down till we find a blank line
                    // i + 1 because i should be the function definition line, we want the comment line underneath it
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Argument header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j]) && 
                        lines[j+1].trim().indexOf("Decorators:") !== 0) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Args:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line plus blank line above it were added
                            for (let k = 0; k < toAddParams.kwargs.length; k++) {
                                var kwargInfo = toAddParams.kwargs[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionKeywordArgument",indentation,kwargInfo.kwarg);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        // **************** Exceptions **************//
        if (toAddParams.exceptions.length > 0) {
            logger_1.logDebug("Found exceptions to add");
            for (var i = linePosition - 1; i >= 0; i--) {
                if (lines[i].trim().indexOf("Raises:") === 0){
                    // Found our line, insert the lines
                    logger_1.logDebug("Found starting line at " + i);
                    const indentation = utilities_1.getIndentation(lines[i]) + " ".repeat(this.editor.options.tabSize);
                    for (let j = i+0; j < linePosition; j++) {
                        // Look for the blank ending line
                        if ((0, utilities_1.blankLine)(lines[j])) {
                            // Found blank line, insert here
                            logger_1.logDebug("Found blank line at " + j);
                            for (let k = 0; k < toAddParams.exceptions.length; k++) {
                                var exceptionInfo = toAddParams.exceptions[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionException",indentation,exceptionInfo.exception);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                } else if (lines[i].trim().indexOf("def ") === 0) {
                    // Did not find our line, we need to insert a new section
                    // Search down till we find a blank line
                    // i + 1 because i should be the class definition line, we want the comment line underneath it
                    const indentation = utilities_1.getIndentation(lines[i+1]) + " ".repeat(this.editor.options.tabSize);
                    logger_1.logDebug("Did not find Exceptions header");
                    logger_1.logDebug("Indendation:|" + indentation + "|");
                    for (let j = i+0; j < linePosition; j++) {
                        if ((0, utilities_1.blankLine)(lines[j]) && 
                        lines[j+1].trim().indexOf("Args:") !== 0 && 
                        lines[j+1].trim().indexOf("Decorators:") !== 0) {
                            logger_1.logDebug("Found blank line at " + j);
                            this.editor.insertSnippet(
                                new vs.SnippetString("\n" + utilities_1.getIndentation(lines[i+1]) + "Raises:\n"),
                                position.with(j,0));
                            j = j + 2; // because heading line plus blank line above it were added
                            for (let k = 0; k < toAddParams.exceptions.length; k++) {
                                var exceptionInfo = toAddParams.exceptions[k];
                                var insertPosition = position.with(j+k,0);
                                var snippet = this.generateSnippet("FunctionException",indentation,exceptionInfo.exception);
                                this.editor.insertSnippet(snippet,insertPosition);
                                linePosition++; // For later loops
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    generateSnippet(templateName, indendation, info) {
        const fileName = "google" + templateName + ".mustache";
        const filePath = __dirname + "/templates/" + fileName;
        let docstring = indendation + (0, mustache_1.render)(fs_1.readFileSync(filePath, "utf8"),info);
        return new vs.SnippetString(docstring);
    }
};

