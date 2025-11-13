import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import NavBar from "../components/NavBar";


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

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
