import { ThemeProvider } from "@emotion/react";
import AppRouting from "./routing/AppRouting";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
        <ToastContainer 
          containerId="global-toast"
          position="top-right"
          autoClose={3000}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
