import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../authentication/AuthContext";
import { RequireAuth } from "../authentication/RequireAuth";
import { RequireAdmin } from "../authentication/RequireAdmin";
import { Home } from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TaskForm from "../pages/TaskForm";
import { TaskDetailPage } from "../pages/TaskDetailPage";
import { ROUTES } from "./routes";
import { AdminPanel } from "../pages/AdminPanel";

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

interface AppRoutingProps {
  consumeEnergy: (ammount: number) => void;
}

function AppRouting({ consumeEnergy }: AppRoutingProps) {
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
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.home} replace />} />
        <Route path={ROUTES.login} element={<Navigate to={ROUTES.home} replace />} />
        <Route path={ROUTES.register} element={<Navigate to={ROUTES.home} replace />} />
        <Route
          path={ROUTES.home}
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path={`${ROUTES.manageTask}/:id?`}
          element={
            <RequireAuth>
              <TaskForm />
            </RequireAuth>
          }>

        </Route>
        <Route
          path={`${ROUTES.task}/:id`}
          element={
            <RequireAuth>
              <TaskDetailPage consumeEnergy={consumeEnergy} />
            </RequireAuth>
          }>
        </Route>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }>
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={authPageSx}>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.login} replace />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />
        <Route path={`${ROUTES.manageTask}/:id?`} element={<Navigate to={ROUTES.login} replace />} />
        <Route path={`${ROUTES.task}/:id`} element={<Navigate to={ROUTES.login} replace />} />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={ROUTES.root} replace />} />

      </Routes>
    </Box>
  );
}
export default AppRouting;
