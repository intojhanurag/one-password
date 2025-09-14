"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_BASE_URL = 'http://localhost:5000';
function activate(context) {
    //Login Command
    context.subscriptions.push(vscode.commands.registerCommand('onePassword.login', async () => {
        const email = await vscode.window.showInputBox({ prompt: 'Enter your email' });
        if (!email)
            return;
        const password = await vscode.window.showInputBox({ prompt: 'Enter your password' });
        if (!password)
            return;
        try {
            const res = await (0, node_fetch_1.default)(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Login failed');
            }
            const data = await res.json();
            await context.globalState.update('onePasswordToken', data.token);
            vscode.window.showInformationMessage('Login successful!');
        }
        catch (err) {
            vscode.window.showErrorMessage('Login failed: ' + err.message);
        }
    }));
    //Detect .env file changes and show API key picker
    vscode.workspace.onDidChangeTextDocument(async (event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.document.fileName.endsWith('.env'))
            return;
        if (event.document !== editor.document)
            return;
        const change = event.contentChanges[0];
        if (!change)
            return;
        const lineText = editor.document.lineAt(change.range.start.line).text;
        console.log(lineText);
        const match = lineText.match(/(\w+_API_KEY)\s*=\s*$/);
        console.log(match);
        if (!match)
            return;
        const token = context.globalState.get('onePasswordToken');
        if (!token) {
            vscode.window.showWarningMessage('Please login with OnePassword first.');
            return;
        }
        let apiKeys = [];
        try {
            const res = await (0, node_fetch_1.default)(`${API_BASE_URL}/apikeys/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok)
                throw new Error('Failed to fetch API keys');
            const data = await res.json();
            apiKeys = data.apiKeys || [];
            if (apiKeys.length === 0) {
                vscode.window.showInformationMessage('No API keys found in your account.');
                return;
            }
        }
        catch (err) {
            vscode.window.showErrorMessage('Error fetching API keys: ' + err.message);
            return;
        }
        // Show QuickPick
        const selected = await vscode.window.showQuickPick(apiKeys.map(k => ({
            label: k.name,
            description: k.description,
            detail: k.value,
        })), { placeHolder: 'Select an API key to insert' });
        if (!selected)
            return;
        const keyStart = lineText.indexOf(match[1]) + match[1].length + 1;
        const range = new vscode.Range(change.range.start.line, keyStart, change.range.start.line, lineText.length);
        await editor.edit(editBuilder => {
            editBuilder.replace(range, selected.detail);
        });
        try {
            await (0, node_fetch_1.default)(`${API_BASE_URL}/dashboard/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ apiKeyName: selected.label, action: 'used' })
            });
        }
        catch {
        }
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map