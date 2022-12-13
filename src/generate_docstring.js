"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require("path");
const vs = require("vscode");
const fs_1 = require("fs");
const docstring_factory_1 = require("./docstring_factory");
const parse_1 = require("./parse/index");
const logger_1 = require("./logger");

exports.AutoDocstring = class {
    constructor(editor,docType="function") {
        this.editor = editor;
        this.docType = docType;
    }
    generateDocstring() {
        if (this.editor === undefined || this.editor === null) {
            throw new Error("Cannot process this document");
        }
        const position = this.editor.selection.active;
        const document = this.editor.document.getText();
        (0, logger_1.logInfo)(`Generating Docstring at line: ${position.line}`);
        const docstringSnippet = this.generateDocstringSnippet(document, position);
        (0, logger_1.logInfo)(`Docstring generated:\n${docstringSnippet.value}`);
        const insertPosition = position.with(undefined, 0);
        (0, logger_1.logInfo)(`Inserting at position & character: ${insertPosition.line} ${insertPosition.character}`);
        const success = this.editor.insertSnippet(docstringSnippet, insertPosition);
        success.then(() => (0, logger_1.logInfo)("Successfully inserted docstring"), (reason) => {
            throw new Error("Could not insert docstring: " + reason.toString());
        });
        return success;
    }
    generateDocstringSnippet(document, position) {
        // const config = this.getConfig();
        const docstringFactory = new docstring_factory_1.DocstringFactory(this.getTemplate(), this.docType);
        (0, logger_1.logDebug)("docstringFactory to string: " + docstringFactory.toString());
        
        const docstringParts = (0, parse_1.parseDocument)(document, position.line, this.docType);
        
        const defaultIndentation = (void 0, parse_1.getDefaultIndentation)(this.editor.options.insertSpaces, this.editor.options.tabSize);
        (0, logger_1.logDebug)("Default indentation: |" + defaultIndentation + "|");
        const indentation = (void 0, parse_1.getDocstringIndentation)(document, position.line, defaultIndentation);
        (0, logger_1.logDebug)("Docstring indentation: |" + indentation + "|");
        
        const docstring = docstringFactory.generateDocstring(docstringParts, indentation);
    
        return new vs.SnippetString(docstring);
    }
    getTemplate() {
        // const config = this.getConfig();
        // let customTemplatePath = config.get("customTemplatePath").toString();
        // if (customTemplatePath === "") {
        // 	const docstringFormat = config.get("docstringFormat").toString();
        // 	return (void 0, getTemplate)(docstringFormat);
        // }
        // if (!path.isAbsolute(customTemplatePath)) {
        // 	customTemplatePath = path.join (vs.workspace.rootPath, customTemplatePath);
        // }
        // return (void 0, getCustomTemplate)(customTemplatePath);
        //const docstringFormat = vs.workspace.getConfiguration("autoclassdocstring").get("docstringFormat");

        const docstringFormat = this.docType === "class" ? "googleClass" : "google";
        return (void 0, getTemplate)(docstringFormat);
    }
    getConfig() {
        return vs.workspace.getConfiguration("autoclassdocstring");
    }
}

function getTemplate (docstringFormat) {
    const fileName = docstringFormat + ".mustache";
    const filePath = __dirname + "/templates/" + fileName;
    return fs_1.readFileSync(filePath, "utf8");
}
exports.getTemplate = getTemplate;

