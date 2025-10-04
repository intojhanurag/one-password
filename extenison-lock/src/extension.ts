import * as vscode from "vscode";
import { authenticate } from "./authentication";
import { TokenManager } from "./TokenManager";

export function activate(context: vscode.ExtensionContext) {
  // make globalState available to TokenManager
  TokenManager.setGlobalState(context.globalState);

  const disposable = vscode.commands.registerCommand("myExtension.login", async () => {
    authenticate(() => {
      vscode.window.showInformationMessage("User Authenticated Successfully!");
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

