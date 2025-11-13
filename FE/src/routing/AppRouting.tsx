import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../authentication/AuthContext";
import { RequireAuth } from "../authentication/RequireAuth";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NavBar from "../components/NavBar";

const mainPageSx = {
  display: "flex",
  position: "fixed",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundSize: "cover",
  top: 0,
  left: 0,
};

function AppRouting() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={mainPageSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {authenticated && <NavBar/>}
      <Box sx={{
        ...mainPageSx,
        justifyContent: authenticated ? 'flex-start' : 'center',
        overflow: 'auto',
      }}>
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={authenticated ? <Navigate to="/home" replace /> : <Register />}
          />

          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage/>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}
export default AppRouting;
