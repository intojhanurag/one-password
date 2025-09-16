const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://one-password-api-latest.onrender.com';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
}



export interface LoginResponse extends AuthUser {
  token: string;
}

export interface SignupResponse extends AuthUser {
  token: string;
}

// Dashboard/teams types
export interface Team {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMembership {
  id: number;
  teamId: number;
  userId: number;
  status: string;
  createdAt: string;
}

export interface APIKeyTeam {
  id: number;
  teamId: number;
  apiKeyId: number;
  createdAt: string;
}

// API Keys types
export interface APIKey {
  id: number;
  name: string;
  ownerId: number;
  description?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

class APIService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        message = errorData?.error || errorData?.message || message;
      } catch {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch {
          // ignore
        }
      }
      throw new Error(message);
    }
    return response.json();
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = REQUEST_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  // Auth endpoints
  async signup(data: { fullName: string; email: string; password: string }): Promise<SignupResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<SignupResponse>(response);
  }

  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  // Dashboard endpoints
  async getDashboard(): Promise<{
    totalApiKeys: number;
    totalTeams: number;
    securityPercent: number;
    activitiesThisWeek: number;
    recentApiKeys: APIKey[];
    recentlyUsedKeys: APIKey[];
  }> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{
      totalApiKeys: number;
      totalTeams: number;
      securityPercent: number;
      activitiesThisWeek: number;
      recentApiKeys: APIKey[];
      recentlyUsedKeys: APIKey[];
    }>(response);
  }

  async getTeamsDashboard(): Promise<{
    totalTeams: number;
    teamsOwnedCount: number;
    totalMembers: number;
    sharedKeys: number;
    teamsOwned: Array<{ id: number; name: string; description?: string; createdAt: string }>;
  }> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/dashboard/teams`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{
      totalTeams: number;
      teamsOwnedCount: number;
      totalMembers: number;
      sharedKeys: number;
      teamsOwned: Array<{ id: number; name: string; description?: string; createdAt: string }>;
    }>(response);
  }

  // API Keys endpoints
  async createAPIKey(data: { name: string; key: string; description?: string; tags?: string }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikeys`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<unknown>(response);
  }

  async listAPIKeys(): Promise<APIKey[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikeys/list`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<APIKey[]>(response);
  }

  async revealAPIKey(name: string) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikeys/reveal`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<string | { key: string }>(response);
  }

  async deleteAPIKey(name: string) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikeys/delete`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  // Teams endpoints
  async createTeam(data: { name: string; description?: string }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<unknown>(response);
  }

  // Team Memberships endpoints
  async createTeamMembership(data: { teamId: number; userId: number }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/team-memberships`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TeamMembership[]>(response);
  }

  async listTeamMemberships(): Promise<TeamMembership[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/team-memberships/list`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TeamMembership[]>(response);
  }

  async deleteTeamMembership(data: { teamId: number; userId: number }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/team-memberships/delete`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<unknown>(response);
  }

  // API Key-Team relationship endpoints
  async attachAPIKeyToTeam(data: { teamId: number; apiKeyId: number }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikey-teams`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<APIKeyTeam[]>(response);
  }

  async listAPIKeyTeams(teamId: number): Promise<APIKeyTeam[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikey-teams/list?team_id=${teamId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<APIKeyTeam[]>(response);
  }

  async detachAPIKeyFromTeam(data: { teamId: number; apiKeyId: number }) {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/apikey-teams/delete`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<unknown[]>(response);
  }

  // Activity endpoints
  async listActivities(): Promise<unknown[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/dashboard/activity`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<unknown[]>(response);
  }

  async getActivityStats(): Promise<unknown> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/dashboard/activity/detail`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/health`,{});
    return this.handleResponse<{ status: string }>(response);
  }
}

export const apiService = new APIService();
