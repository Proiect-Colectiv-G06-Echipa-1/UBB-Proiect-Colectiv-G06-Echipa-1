import { ThemeProvider } from "@emotion/react";
import AppRouting from "./routing/AppRouting";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthContext";
import { TopNav } from "./components/TopNav";
import { ROUTES } from "./routing/routes";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const isLoginOrRegister = [ROUTES.login, ROUTES.register].includes(location.pathname);

  return (
    <>
      {!isLoginOrRegister && <TopNav />}
      <AppRouting />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <ToastContainer 
          containerId="global-toast"
          position="bottom-left"
          autoClose={2000}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
