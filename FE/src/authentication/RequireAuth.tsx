/**
 * @file RequireAuth.tsx
 * @brief Component that protects routes from unauthenticated access.
 */
import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

/**
 * @brief Wrapper component that checks if a user is authenticated.
 * @param children The components to render if the user is authenticated.
 * @return Returns a loading spinner if checking authentication, 
 *         otherwise redirects to login or renders children.
 */
export function RequireAuth({ children }: { children: JSX.Element }) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
