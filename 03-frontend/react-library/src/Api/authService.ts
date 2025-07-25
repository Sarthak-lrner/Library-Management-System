import api from "./apiClient";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

let accessToken: string | null = null;

const authService = {
  registerUser: (data: RegisterData) => api.post("/auth/register", data),

  loginUser: async (data: LoginData) => {
    const response = await api.post("/auth/login", data, { withCredentials: true });
    accessToken = response.data.accessToken;
    return response.data;
  },

  getAccessToken: () => accessToken,

  setAccessToken: (token: string) => {
    accessToken = token;
  },

  refreshToken: async (): Promise<string> => {
    const rawRefreshToken = localStorage.getItem("refreshToken");
    const refreshToken = rawRefreshToken?.trim();

    if (!refreshToken) throw new Error("No refresh token stored");

    const response = await api.post("/auth/refresh", { refreshToken });

    if (!response.data.accessToken) {
      throw new Error("No access token in refresh response");
    }

    accessToken = response.data.accessToken;
    return accessToken as string;
  },

  logout: () => {
    accessToken = null;
  },

  getUserClaims: () => {
    if (!accessToken) return null;

    try {
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      return {
        email: payload.sub || null,
        role: payload.roles || null,
      };
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }
};

export default authService;
