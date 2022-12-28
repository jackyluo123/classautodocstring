"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
exports.TemplateFunctionData = class {
    constructor(docstringParts, guessTypes, includeName, includeExtendedSummary) {
        this.name = docstringParts.name;
        this.decorators = docstringParts.decorators;
        this.args = docstringParts.args;
        this.kwargs = docstringParts.kwargs;
        this.exceptions = docstringParts.exceptions;
        this.returns = docstringParts.returns;
        this.yields = docstringParts.yields;
        this.includeName = includeName;
        this.includeExtendedSummary = includeExtendedSummary;
        if (!guessTypes) {
            this.removeTypes();
        }
        this.addDefaultTypePlaceholders("_type_");
    }
    placeholder() {
        return (text, render) => {
            return "${@@@:" + render(text) + "}";
        };
    }
    summaryPlaceholder() {
        if (this.includeName) {
            return this.name + " ${@@@:_summary_}";
        }
        return "${@@@:_summary}";
    }
    extendedSummaryPlaceholder() {
        if (this.includeExtendedSummary) {
            return "${@@@:_extended_summary_}";
        }
        return "";
    }
    typePlaceholder() {
    	return "${@@@:" + this.type + "}";
    }
    descriptionPlaceholder() {
        return "${@@@:_description_}";
    }
    argsExist() {
        return this.args.length > 0;
    }
    kwargsExist() {
        return this.kwargs.length > 0;
    }
    parametersExist() {
        return this.args.length > 0 || this.kwargs.length > 0;
    }
    exceptionsExist() {
        return this.exceptions.length > 0;
    }
    decoratorsExist() {
        return this.decorators.length > 0;
    }
    returnsExist() {
        return this.returns !== undefined && this.returns !== null;
    }
    yieldsExist() {
        return this.yields !== undefined && this.yields !== null;
    }
    removeTypes() {
        for (const arg of this.args) {
            arg.type = undefined;
        }
        for (const kwarg of this.kwargs) {
            kwarg.type = undefined;
        }
        if (this.yieldsExist()) {
            this.yields.type = undefined;
        }
        if (this.returnsExist()) {
            this.returns.type = undefined;
        }
    }
    addDefaultTypePlaceholders(placeholder) {
        for (const arg of this.args) {
            if (arg.type === undefined) {
                arg.type = placeholder;
            }
        }
        for (const kwarg of this.kwargs) {
            if (kwarg.type === undefined) {
                kwarg.type = placeholder;
            }
        }
        const returns = this.returns;
        if (returns !== undefined && (returns.type === undefined || returns.type === null)) {
            returns.type = placeholder;
        }
        const yields = this.yields;
        if (yields !== undefined && yields.type === undefined) {
            yields.type = placeholder;
        }
    }
};
//exports.TemplateData = TemplateData;

class TemplateClassData {
    constructor(docstringParts, guessTypes, includeName, includeExtendedSummary) {
        this.name = docstringParts.name;
        this.decorators = docstringParts.decorators;
        this.args = docstringParts.args;
        this.attributes = docstringParts.attributes;
        this.functions = docstringParts.functions;
        this.exceptions = docstringParts.exceptions;
        this.includeName = includeName;
        this.includeExtendedSummary = includeExtendedSummary;
        if (!guessTypes) {
            this.removesTypes();
        }
        this.addDefaultTypePlaceholders("_type_");
    }
    placeholder() {
        return (text, render) => {
            return "${@@@:" + render(text) + "}";
        };
    }
    summaryPlaceholder() {
        if (this.includeName) {
            return this.name + " ${@@@:_summary_}";
        }
        return "${@@@:_summary_}";
    }
    extendedSummaryPlaceholder() {
        if (this.includeExtendedSummary) {
            return "${@@@:_extended_summary_}";
        }
        return "";
    }
    typePlaceholder() {
        // @ts-ignore
        return "${@@@:" + this.type + "}";
    }
    descriptionPlaceholder() {
        return "${@@@:_description_}";
    }
    parametersExist() {
        return this.args.length > 0;
    }
    attributesExist() {
        return this.attributes.length > 0;
    }
    exceptionsExist() {
        return this.exceptions.length > 0;
    }
    decoratorsExist() {
        return this.decorators.length > 0;
    }
    methodsExist() {
        return this.functions.length > 0;
    }
    removeTypes() {
        for (const attr of this.attributes) {
            attr.type = undefined;
        }
    }
    addDefaultTypePlaceholders(placeholder) {
        for (const attr of this.attributes) {
            if (attr.type === undefined || attr.type === null) {
                attr.type = placeholder;
            }
        }
    }
}
exports.TemplateClassData = TemplateClassData;