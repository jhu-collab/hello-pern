import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Debug from "debug";
import NotAllowed from "../pages/NotAllowed";

const debug = new Debug(`demo:layouts:AdminOnlyRoute.jsx`);

function AdminOnlyRoute() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return isAdmin() ? <Outlet /> : <NotAllowed />;
}

export default AdminOnlyRoute;
