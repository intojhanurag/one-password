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
exports.authenticate = authenticate;
const vscode = __importStar(require("vscode"));
const express_1 = __importDefault(require("express"));
const TokenManager_1 = require("./TokenManager");
function authenticate(onSuccess) {
    const app = (0, express_1.default)();
    app.use(express_1.default.urlencoded({ extended: true }));
    const server = app.listen(54321, (err) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
        }
        else {
            vscode.env.openExternal(vscode.Uri.parse("https://one-password-web.vercel.app/auth/login?redirect=http://localhost:54321/auth"));
        }
    });
    app.get("/auth/:token", async (req, res) => {
        const { token } = req.params;
        if (!token) {
            res.send("<h1>Something went wrong</h1>");
            return;
        }
        await TokenManager_1.TokenManager.setToken(token);
        onSuccess();
        res.send("<h1>Authentication was successful, you can close this now</h1>");
        server.close();
    });
}
//# sourceMappingURL=authentication.js.map