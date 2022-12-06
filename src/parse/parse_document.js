"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocument = void 0;
// Import all files in this folder
const _1 = require(".");
const logger_1 = require("../logger");

function parseDocument(document, positionLine, docType = "function") {

    if (docType === "function") {
        (0, logger_1.logDebug)("Grabbing Function Definition...");
        const functionDefinition = (0, _1.getFunctionDefinition)(document, positionLine);
        (0, logger_1.logDebug)("Function Definition: " + functionDefinition.toString());

        (0, logger_1.logDebug)("Grabbing Function Body...");
        const functionBody = (0, _1.getFunctionBody)(document, positionLine);
        (0, logger_1.logDebug)("Function Body parsed successfully!");

        (0, logger_1.logDebug)("Tokenizing function definition...");
        const parameterTokens = (0, _1.tokenizeFunctionDefinition)(functionDefinition);
        (0, logger_1.logDebug)("Tokenizing finished!");

        (0, logger_1.logDebug)("Grabbing Function Name...");
        const functionName = (0, _1.getFunctionName)(functionDefinition);
        (0, logger_1.logDebug)("Function Name: " + functionName);

        (0, logger_1.logDebug)("Creating docstringParts...");
        const docstringParts = (0, _1.parseFunctionParameters)(parameterTokens, functionBody, functionName);
        (0, logger_1.logDebug)("docstringParts creation successful!");

        return docstringParts;
    } else if (docType === "class") {
        (0, logger_1.logDebug)("Grabbing Class Definition...");
        const classDefinition = (0, _1.getClassDefinition)(document, positionLine);
        (0, logger_1.logDebug)("Class Definition: " + classDefinition.toString());
    
        (0, logger_1.logDebug)("Grabbing Class Body...");
        const classBody = (0, _1.getClassBody)(document, positionLine);
        (0, logger_1.logDebug)("Class Body: " + classBody);
    
        (0, logger_1.logDebug)("Grabbing Class Name...");
        const className = (0, _1.getClassName)(classDefinition);  
        (0, logger_1.logDebug)("Class Name: " + className);
    
        (0, logger_1.logDebug)("Tokenizing class definition...");
        const parameterTokens = (0, _1.tokenizeClassDefinition)(classDefinition);
        (0, logger_1.logDebug)("Tokenizing finished!");
    
        (0, logger_1.logDebug)("Creating docstringParts...");
        const docstringParts = (0, _1.parseClassParameters)(parameterTokens, classBody, className);
        (0, logger_1.logDebug)("docstringParts creation successful!");

        return docstringParts;
    }
    //const docstringParts = "sampleparts"; 
    return "";
}
exports.parseDocument = parseDocument;