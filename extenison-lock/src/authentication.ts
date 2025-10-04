import * as vscode from "vscode";
import express from "express";
import { TokenManager } from "./TokenManager";

export function authenticate(onSuccess: () => void) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));

  const server = app.listen(54321, (err?: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.env.openExternal(vscode.Uri.parse("https://one-password-web.vercel.app/auth/login?redirect=http://localhost:54321/auth"));
    }
  });

  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.send("<h1>Something went wrong</h1>");
      return;
    }

    await TokenManager.setToken(token);
    onSuccess();
    res.send("<h1>Authentication was successful, you can close this now</h1>");
    server.close();
  });
}
