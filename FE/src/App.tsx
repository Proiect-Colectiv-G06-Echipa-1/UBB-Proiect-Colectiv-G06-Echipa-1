<<<<<<< HEAD
import { ThemeProvider } from "@emotion/react";
import AppRouting from "./routing/AppRouting";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthContext";
import { TopNav } from "./components/TopNav";
import { ROUTES } from "./routing/routes";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';

function AppContent() {
  const location = useLocation();
  const isLoginOrRegister = [ROUTES.login, ROUTES.register].includes(location.pathname);
  const [energyLevel, setEnergyLevel] = useState<number | undefined>(undefined);

  const consumeEnergy = (ammount: number) => {
    if (energyLevel === undefined) {
      return;
    }

    // FIXME: very bad for multiple reasons but i am running out of time
    const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

    const newEnergyValue = energyLevel - ammount;
    setEnergyLevel(clamp(newEnergyValue));
  }

  return (
    <>
      {!isLoginOrRegister && <TopNav energyLevel={energyLevel} setEnergyLevel={setEnergyLevel} />}
      <AppRouting consumeEnergy={consumeEnergy} />
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
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> production
