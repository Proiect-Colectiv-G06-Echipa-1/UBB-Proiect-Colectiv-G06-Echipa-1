import React, { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { getTokenData } from "./DecodeToken";

interface IAuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  username: string | null;
  refreshAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  isAdmin: false,
  loading: true,
  username: null,
  refreshAuth: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    setLoading(true);
    
    const tokenData = getTokenData();
    
    if (!tokenData || !tokenData.username) {
      setAuthenticated(false);
      setIsAdmin(false);
      setUsername(null);
      setLoading(false);
      return;
    }
    
    setAuthenticated(true);
    setUsername(tokenData.username);
    
    // Fetch user role to check if admin
    try {
      const response = await fetch('http://localhost:8080/api/auth/role', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
        },
      });
      
      if (response.ok) {
        const role = await response.json();
        setIsAdmin(role === 'ROLE_ADMIN');
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setIsAdmin(false);
    }
    
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
  };
  
  const value: IAuthContext = {
    authenticated,
    isAdmin,
    loading,
    username,
    refreshAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
