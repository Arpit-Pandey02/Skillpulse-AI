const BASE_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  skill?: any;
  activity?: any;
  count?: number;
}

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem('skillpulse_auth_token');
  },

  setToken(token: string): void {
    localStorage.setItem('skillpulse_auth_token', token);
  },

  clearToken(): void {
    localStorage.removeItem('skillpulse_auth_token');
  },

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({
        success: response.ok,
        message: response.statusText,
      }));

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: Request failed`,
        };
      }

      return data;
    } catch (error: any) {
      console.warn(`[API Client Warning] Failed to reach "${endpoint}":`, error?.message);
      return {
        success: false,
        message: 'Could not connect to backend server. Operating in offline/mock mode.',
      };
    }
  },

  get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};
