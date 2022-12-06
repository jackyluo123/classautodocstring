"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vs = require("vscode");
const parse1 = require("./parse/index");
const generate_docstring_1 = require("./generate_docstring");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autoclassdocstring" is now active!');
    context.subscriptions.push(vs.commands.registerCommand('autoclassdocstring.generateDocstring', () => {
        const editor = vs.window.activeTextEditor;
        const autoDocstring = new generate_docstring_1.AutoDocstring(editor);
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
                if (validEnterActivation(document,position)) {
                    return [new AutoDocstringCompletionItem(document, position)];
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

function validEnterActivation(document,position) {
    const docString = document.getText();
    const prefixStyle = getPrefixStyle();
    const validPrefix = (0, parse1.validDocstringPrefix)(docString, position.line, position.character, prefixStyle);
    const closedDocstring = !(0, parse1.docstringIsClosed)(docString, position.line, position.character, prefixStyle);
    return validPrefix && closedDocstring;
}

class AutoDocstringCompletionItem extends vs.CompletionItem {
    constructor(_, position) {
        super("Generate Docstring", vs.CompletionItemKind.Snippet);
        this.insertText = "";
        this.filterText = getPrefixStyle();
        this.sortText = "\0";
        this.range = new vs.Range(new vs.Position(position.line, 0), position);
        this.command = {
            command: "autoclassdocstring.generateDocstring",
            title: "Generate Class Docstring",
        };
    }
}
function getPrefixStyle() {
    /*return vs.workspace.getConfiguration("autoclassdocstring").get("prefixStyle").toString(); */
    return "###"; // don't know how to grab info from package.json
}
