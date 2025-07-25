import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import authService from "../Api/authService";
import api, { updateAuthStore } from "../Api/apiClient";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = useCallback((message = "You’ve been logged out.") => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);

    alert(message); // 🔁 You can replace this with toast() or modal
    window.location.href = "/login";
  }, []);


  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const newAccessToken = await authService.refreshToken();

      localStorage.setItem("accessToken", newAccessToken);
      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      logout("Session expired. Please log in again.");
      return null;
    }
  }, [logout]);


  // 👇 Only ONE init useEffect
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = localStorage.getItem("accessToken");

      if (storedUser && storedAccessToken) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(newToken);
            setIsLoggedIn(true);
          }
        } catch {
          logout();
        }
      }

      setIsAuthLoading(false);
    };

    initAuth();
  }, [refreshAccessToken, logout]);

  // Ensure axios uses latest auth state
  useEffect(() => {
    updateAuthStore(accessToken, refreshAccessToken, logout, isAuthLoading);
  }, [accessToken, refreshAccessToken, logout, isAuthLoading]);


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.loginUser({ email, password });
      const { accessToken: newAccessToken, refreshToken, role } = res;

      const userData = { email, role };

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setAccessToken(newAccessToken);
      setIsLoggedIn(true);

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  // Block render until token refresh is complete
  if (isAuthLoading) {
    return <SpinnerLoading />
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, accessToken, refreshAccessToken, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
