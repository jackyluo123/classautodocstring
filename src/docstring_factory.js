"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exports.deactivate = exports.activate = void 0;
const template_data_1 = require("./template_data");
const mustache_1 = require("mustache");
const ts_dedent_1 = require("ts-dedent");
const logger_1 = require("./logger");

exports.DocstringFactory = class {
    constructor(template, quoteStyle = '"""', startOnNewLine = true, includeDescription = false, includeName = true, guessTypes = true) {
        this.quoteStyle = quoteStyle;
        this.startOnNewLine = startOnNewLine;
        this.guessTypes = guessTypes;
        this.includeName = includeName;
        this.includeDescription = includeDescription;
        this.template = template;
    }
    toString() {
        return (void 0, ts_dedent_1.dedent) `
		DocstringFactory Configuration
		quoteStyle:
			${this.quoteStyle}
		startOnNewLine:
			${this.startOnNewLine}
		guessTypes:
			${this.guessTypes}
		includeName:
			${this.includeName}
		includeDescription:
			${this.includeDescription}
		template:
		${this.template}
		`;
    }
    generateDocstring(docstringParts, indentation = "") {
        (0, logger_1.logDebug)("FACTORY DOCSTRING GENERATION STARTED...");
        const templateData = new template_data_1.TemplateClassData(docstringParts, this.guessTypes, this.includeName, this.includeDescription);
        (0, logger_1.logDebug)("    Template Data done!");
        let docstring = (0, mustache_1.render)(this.template, templateData);
        (0, logger_1.logDebug)("    Mustache Render done!");
        docstring = this.addSnippetPlaceholders(docstring);
        (0, logger_1.logDebug)("    addSnippetPlaceholders done!");
        docstring = this.condenseNewLines(docstring);
        (0, logger_1.logDebug)("    condenseNewLines done!");
        docstring = this.commentText(docstring);
        (0, logger_1.logDebug)("    commentText done!");
        docstring = this.indentDocstring(docstring, indentation);
        (0, logger_1.logDebug)("    indentDocstring done!");
        return docstring;
    }
    addSnippetPlaceholders(snippetString) {
        let placeholderNumber = 0;
        snippetString = snippetString.replace(/@@@/g, () => {
            return (++placeholderNumber).toString();
        });
        return snippetString;
    }
    condenseNewLines(snippet) {
        return snippet.replace(/\n{3,}/gm, "\n\n");
    }
    condenseTrailingNewLines(snippet) {
        return snippet.replace(/\n+$/g, "\n");
    }
    commentText(snippet) {
        if (this.startOnNewLine) {
            snippet = "\n" + snippet;
        }
        return this.quoteStyle + snippet + this.quoteStyle;
    }
    indentDocstring(snippet, indentation) {
        const snippetLines = snippet.split("\n");
        snippetLines.forEach((line, index) => {
            if (line !== "") {
                snippetLines[index] = indentation + line;
            }
        });
        return snippetLines.join("\n");
    }
}
//exports.DocstringFactory = DocstringFactory;