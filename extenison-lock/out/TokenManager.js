"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const KEY = "your_token_name";
class TokenManager {
    static globalState;
    static setGlobalState(state) {
        this.globalState = state;
    }
    static async setToken(token) {
        return this.globalState.update(KEY, token);
    }
    static getToken() {
        return this.globalState.get(KEY);
    }
    static async removeToken() {
        return this.globalState.update(KEY, null);
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=TokenManager.js.map