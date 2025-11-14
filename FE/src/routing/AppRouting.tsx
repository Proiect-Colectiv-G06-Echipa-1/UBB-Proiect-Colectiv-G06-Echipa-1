import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../authentication/AuthContext";
import { RequireAuth } from "../authentication/RequireAuth";
import { Home } from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const loadingPageSx = {
  display: "flex",
  position: "fixed",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
};

const authPageSx = {
  display: "flex",
  position: "fixed",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  overflow: 'auto',
};

function AppRouting() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={loadingPageSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (authenticated) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={authPageSx}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}
export default AppRouting;
