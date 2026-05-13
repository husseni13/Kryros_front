import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "/backend") + "/api";

export type AuthUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  country?: string;
  memberSince?: string;
  ordersCount?: number;
  reviewsCount?: number;
  couponsCount?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  refetchUser: () => {},
});

async function fetchUserFromApi(token: string): Promise<AuthUser | null> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const endpoints = ["/auth/me", "/users/profile", "/users/me"];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { headers });
      if (res.ok) {
        const data = await res.json();
        const u = data.data || data.user || data;
        return {
          id: u.id || u._id || "",
          firstName: u.firstName || u.first_name || "",
          lastName: u.lastName || u.last_name || "",
          name: u.name || `${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`.trim() || u.email?.split("@")[0] || "User",
          email: u.email || "",
          phone: u.phone || u.phoneNumber || "",
          avatar: u.avatar || u.avatarUrl || "",
          country: u.country || "",
          memberSince: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "",
          ordersCount: u.ordersCount ?? u._count?.orders ?? 0,
          reviewsCount: u.reviewsCount ?? u._count?.reviews ?? 0,
          couponsCount: u.couponsCount ?? u._count?.coupons ?? 0,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function getInitials(user: AuthUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.name) {
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  }
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "ME";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = useCallback(async (t: string) => {
    setIsLoading(true);
    try {
      const u = await fetchUserFromApi(t);
      if (u) {
        u.avatar = u.avatar || getInitials(u);
        setUser(u);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setUser(null);
    }
  }, [token, fetchUser]);

  const login = useCallback((newToken: string, preloadedUser?: AuthUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (preloadedUser) {
      preloadedUser.avatar = preloadedUser.avatar || getInitials(preloadedUser);
      setUser(preloadedUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const refetchUser = useCallback(() => {
    if (token) fetchUser(token);
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, isLoading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
