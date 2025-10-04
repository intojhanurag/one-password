const KEY = "your_token_name";

export class TokenManager {
  private static globalState: import("vscode").Memento;

  static setGlobalState(state: import("vscode").Memento) {
    this.globalState = state;
  }

  static async setToken(token: string) {
    return this.globalState.update(KEY, token);
  }

  static getToken(): string | undefined {
    return this.globalState.get(KEY);
  }

  static async removeToken() {
    return this.globalState.update(KEY, null);
  }
}
