import React, { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { getUsernameFromToken, getUserIdFromToken, getRoleFromToken } from "./DecodeToken";  // MODIFICAT
import { UserDTORoleEnum } from "../../typescript-client";

interface IAuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  username: string | null;
  userId: number | null;
  refreshAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  isAdmin: false,
  loading: true,
  username: null,
  userId: null,
  refreshAuth: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    setLoading(true);
    
    const username = getUsernameFromToken();
    const id = getUserIdFromToken();  // ADĂUGAT
    const role = getRoleFromToken();
    
    if (!username || !role) {
      setAuthenticated(false);
      setIsAdmin(false);
      setUsername(null);
      setUserId(null);
      setLoading(false);
      return;
    }
    
    setAuthenticated(true);
    setUsername(username);
    setUserId(id);  // ADĂUGAT
    setIsAdmin(role === UserDTORoleEnum.RoleAdmin);
    setLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    setAuthenticated(false);
    setIsAdmin(false);
    setUsername(null);
    setUserId(null);
  };
  
  const value: IAuthContext = {
    authenticated,
    isAdmin,
    loading,
    username,
    userId,
    refreshAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);