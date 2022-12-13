"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vs = require("vscode");
const parse_1 = require("./parse/index");
const generate_docstring_1 = require("./generate_docstring");
const update_docstring_1 = require("./update_docstring");
const logger_1 = require("./logger");


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autoclassdocstring" is now active!');

    // For functions
    context.subscriptions.push(vs.commands.registerCommand('autoclassdocstring.generateFunctionDocstring', () => {
        const editor = vs.window.activeTextEditor;
        const autoDocstring = new generate_docstring_1.AutoDocstring(editor,"function");
        try {
            return autoDocstring.generateDocstring();
        }
        catch (error) {
            console.log('Error occured');
        }
    }));
    context.subscriptions.push(vs.commands.registerCommand('autoclassdocstring.updateFunctionDocstring', () => {
        const editor = vs.window.activeTextEditor;
        const autoDocstring = new update_docstring_1.UpdateAutoDocstring(editor,"function");
        try {
            return autoDocstring.updateDocstring();
        }
        catch (error) {
            console.log('Error occured');
        }
    }));

    context.subscriptions.push(vs.commands.registerCommand('autoclassdocstring.generateClassDocstring', () => {
        const editor = vs.window.activeTextEditor;
        const autoDocstring = new generate_docstring_1.AutoDocstring(editor,"class");
        try {
            return autoDocstring.generateDocstring();
        }
        catch (error) {
            console.log('Error occured');
        }
    }));
    context.subscriptions.push(vs.commands.registerCommand('autoclassdocstring.updateClassDocstring', () => {
        const editor = vs.window.activeTextEditor;
        const autoDocstring = new update_docstring_1.UpdateAutoDocstring(editor,"class");
        try {
            return autoDocstring.updateDocstring();
        }
        catch (error) {
            console.log('Error occured');
        }
    }));


    ['python'].map((language) => {
        context.subscriptions.push(vs.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: (document, position, _) => {
                if (validClassEnterActivation(document,position) || validFunctionEnterActivation(document,position)) {
                    return [new AutoDocstringCompletionItem(document, position)];
                } 
                if (validUpdateActivation(document, position)) {
                    return [new AutoDocstringUpdateCompletionItem(document, position)];
                }
            },
        }, "#"));
    });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    /*
    let disposable = vs.commands.registerCommand('autoclassdocstring.generateDocstring', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vs.window.showInformationMessage('Hello VSCode from autoclassdocstring!');
    });

    context.subscriptions.push(disposable);
    */
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

function validClassEnterActivation(document,position) {
    const docText = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    const validPrefix = (0, parse_1.validDocstringPrefix)(docText, position.line, position.character, prefixStyle);
    // Normally we want the closedDocstring to be false, but since the prefix style != the quote style, we want this to be true
    const closedDocstring = (0, parse_1.docstringIsClosed)(docText, position.line, position.character, quoteStyle);
    const validClassPrecedingLine = (0, parse_1.validClassPrecedingLine)(docText, position.line);
    return validPrefix && closedDocstring && validClassPrecedingLine;
}

function validFunctionEnterActivation(document,position) {
    const docText = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    const validPrefix = (0, parse_1.validDocstringPrefix)(docText, position.line, position.character, prefixStyle);
    const closedDocstring = (0, parse_1.docstringIsClosed)(docText, position.line, position.character, quoteStyle);
    const validFunctionPrecedingLine = (0, parse_1.validFunctionPrecedingLine)(docText, position.line);
    return validPrefix && closedDocstring && validFunctionPrecedingLine;
}

/**
 * This method returns when the user typed the input keywords within a comment block
 * @param {*} document 
 * @param {*} position 
 * @returns 
 */
 function validUpdateActivation(document, position) {
    const docText = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    // const validPrefix = (0, parse_1.validDocstringPrefix)(docText, position.line, position.character, prefixStyle);
    const closedDocstring = (0, parse_1.docstringIsClosed)(docText, position.line, position.character, quoteStyle);
    const validDocstring = (0, parse_1.validExistingDocstring)(docText, position.line, quoteStyle, prefixStyle);
    // if (validPrefix) {
    //     console.log("Valid Prefix detected");
    // }
    if (closedDocstring) {
        console.log ("Docstring is closed");
    }
    if (validDocstring) {
        console.log ("Valid existing docstring");
    }
    return (closedDocstring && validDocstring);
}

class AutoDocstringUpdateCompletionItem extends vs.CompletionItem {
    constructor(document, position) {

        if ((0, parse_1.wasFunctionDocstring)(document.getText(), position.line)) {
            super("Update Function Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.updateFunctionDocstring",
                title: "Update Function Docstring",
            };
        } else if ((0, parse_1.wasClassDocstring)(document.getText(), position.line)) {
            super("Update Class Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.updateClassDocstring",
                title: "Update Class Docstring",
            };
        }
        this.insertText = document.getText().split("\n")[position.line].replace(getPrefixStyle(),"").replace("\r","");
        this.filterText = getQuoteStyle() + getPrefixStyle();
        this.sortText = "\0";
        this.range = new vs.Range(new vs.Position(position.line, 0), position);
    }
}

class AutoDocstringCompletionItem extends vs.CompletionItem {
    constructor(document, position) {
        if ((0, parse_1.validFunctionPrecedingLine)(document.getText(),position.line)) {
            super("Generate Function Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.generateFunctionDocstring",
                title: "Generate Function Docstring",
            };
        } else if ((0, parse_1.validClassPrecedingLine)(document.getText(),position.line)) {
            super("Generate Class Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.generateClassDocstring",
                title: "Generate Class Docstring",
            };
        }
        this.insertText = "";
        this.filterText = getPrefixStyle();
        this.sortText = "\0";
        this.range = new vs.Range(new vs.Position(position.line, 0), position);
    }
}

function getPrefixStyle() {
    /*return vs.workspace.getConfiguration("autoclassdocstring").get("prefixStyle").toString(); */
    return "###"; // don't know how to grab info from package.json
}
function getQuoteStyle() {
    /*return vs.workspace.getConfiguration("autoclassdocstring").get("quoteStyle").toString(); */
    return '"""'; // don't know how to grab info from package.json
}