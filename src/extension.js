"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vs = require("vscode");
const parse_1 = require("./parse/index");
const generate_docstring_1 = require("./generate_docstring");
const { validFunctionPrecedingLine } = require("./parse/valid_preceding_line");
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
    ['python'].map((language) => {
        context.subscriptions.push(vs.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: (document, position, _) => {
                if (validClassEnterActivation(document,position) || validFunctionEnterActivation(document,position)) {
                    return [new AutoDocstringCompletionItem(document, position)];
                } else if (validUpdateActivation(document, position)) {
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
    const documentText = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    const validPrefix = (0, parse_1.validDocstringPrefix)(documentText, position.line, position.character, prefixStyle);
    const closedDocstring = !(0, parse_1.docstringIsClosed)(documentText, position.line, position.character, quoteStyle);
    const validClassPrecedingLine = (0, parse_1.validClassPrecedingLine)(documentText, position.line);
    return validPrefix && closedDocstring && validClassPrecedingLine;
}

function validFunctionEnterActivation(document,position) {
    const documentText = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    const validPrefix = (0, parse_1.validDocstringPrefix)(documentText, position.line, position.character, prefixStyle);
    const closedDocstring = !(0, parse_1.docstringIsClosed)(documentText, position.line, position.character, quoteStyle);
    const validFunctionPrecedingLine = (0, parse_1.validFunctionPrecedingLine)(documentText, position.line);
    return validPrefix && closedDocstring && validFunctionPrecedingLine;
}

/**
 * This method returns when the user typed the input keywords within a comment block
 * @param {*} document 
 * @param {*} position 
 * @returns 
 */
 function validUpdateActivation(document, position) {
    const docString = document.getText();
    const prefixStyle = getPrefixStyle();
    const quoteStyle = getQuoteStyle();
    const validPrefix = (0, parse_1.validDocstringPrefix)(docString, position.line, position.character, prefixStyle);
    const closedDocstring = (0, parse_1.docstringIsClosed)(docString, position.line, position.character, quoteStyle);
    const validDocstring = (0, parse_1.validExistingDocstring)(docString, position.line, quoteStyle);
    return (validPrefix && closedDocstring && validDocstring);
}


class AutoDocstringCompletionItem extends vs.CompletionItem {
    constructor(document, position) {
        if ((0, parse_1.validFunctionPrecedingLine)(document,position)) {
            super("Generate Function Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.generateFunctionDocstring",
                title: "Generate Function Docstring",
            };
        } else if ((0, parse_1.validClassPrecedingLine)(document,position)) {
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

class AutoDocstringUpdateCompletionItem extends vs.CompletionItem {
    constructor(document, position) {
        if ((0, parse_1.wasFunctionDocstring)(document, position)) {
            super("Update Function Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.updateFunctionDocstring",
                title: "Update Function Docstring",
            };
        } else if ((0, parse_1.wasClassDocstring)(document, position)) {
            super("Update Class Docstring", vs.CompletionItemKind.Snippet);
            this.command = {
                command: "autoclassdocstring.updateClassDocstring",
                title: "Update Class Docstring",
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