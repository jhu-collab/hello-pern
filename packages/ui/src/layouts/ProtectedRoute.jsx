import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import WindowFocusHandler from "../components/WindowFocusHandler";
import useAuth from "../hooks/useAuth";
import Debug from "debug";

const debug = new Debug(`demo:layouts:ProtectedRoute.jsx`);

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return isAuthenticated() ? (
    <>
      <WindowFocusHandler />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

export default ProtectedRoute;
