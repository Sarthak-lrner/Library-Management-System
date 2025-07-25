import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

let store: {
  accessToken: string | null;
  refreshAccessToken: (() => Promise<string | null>) | null;
  logout: () => void;
  isAuthLoading?: boolean;
} = {
  accessToken: null,
  refreshAccessToken: null,
  logout: () => {},
  isAuthLoading: false,
};

export const updateAuthStore = (
  accessToken: string | null,
  refreshAccessToken: (() => Promise<string | null>) | null,
  logout: () => void,
  isAuthLoading?: boolean
) => {
  store.accessToken = accessToken;
  store.refreshAccessToken = refreshAccessToken;
  store.logout = logout;
  store.isAuthLoading = isAuthLoading;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/refresh"].some((url) =>
      config.url?.includes(url)
    );
    if (store.accessToken && !isAuthEndpoint) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${store.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.refreshAccessToken &&
      !isRefreshRequest &&
      !store.isAuthLoading
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await store.refreshAccessToken();
        if (newAccessToken) {
          store.accessToken = newAccessToken;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 🔁 retry request
        } else {
          store.logout();
          return Promise.reject(error);
        }
      } catch (refreshError: any) {
        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403
        ) {
          console.warn(" Refresh token expired, logging out.");
        } else {
          console.error(" Refresh token failed:", refreshError);
        }
        store.logout();
        return Promise.reject(refreshError);
      }
    }

    // Suppress logging for expected initial 401s (retry is in progress)
    if (error.response?.status === 401 && originalRequest._retry) {
      // Suppress silently
      return Promise.reject(error);
    }

    //  Log unexpected 401s
    if (error.response?.status === 401) {
      console.warn("❗ Unexpected 401:", error.config.url);
    }

    return Promise.reject(error);
  }
);

export default api;
