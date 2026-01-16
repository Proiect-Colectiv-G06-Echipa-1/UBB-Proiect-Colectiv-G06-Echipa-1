/**
 * @file AuthContext.tsx
 * @brief Context and provider for managing authentication state.
 */
import React, { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { getUsernameFromToken, getUserIdFromToken, getRoleFromToken } from "./DecodeToken";  // MODIFICAT
import { UserDTORoleEnum } from "../../typescript-client";

/**
 * @interface IAuthContext
 * @brief Interface for the authentication context state.
 */
interface IAuthContext {
  authenticated: boolean; ///< Whether the user is currently authenticated.
  isAdmin: boolean; ///< Whether the authenticated user has admin privileges.
  loading: boolean; ///< Whether the authentication state is still loading.
  username: string | null; ///< The username of the authenticated user.
  userId: number | null; ///< The user ID of the authenticated user.
  refreshAuth: () => Promise<void>; ///< Function to refresh authentication state from storage.
  logout: () => void; ///< Function to log out the user.
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

/**
 * @brief Provider component for authentication state.
 * @param children The children components that need access to authentication state.
 */
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

/**
 * @brief Hook to use the authentication context.
 * @return The authentication context state and methods.
 */
export const useAuth = () => useContext(AuthContext);