import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Prediction from "./pages/Prediction";

import Layout from "./components/Layout";

function App() {
  const authenticated = localStorage.getItem("authenticated") === "true";

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={
            authenticated
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        <Route
          element={
            authenticated
              ? <Layout />
              : <Navigate to="/login" replace />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/prediccion" element={<Prediction />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={authenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
