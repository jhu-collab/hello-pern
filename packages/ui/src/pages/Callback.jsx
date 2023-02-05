import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import useStoreToken from "../hooks/useStoreToken";
import Debug from "debug";

const debug = new Debug(`demo:pages:Callback.jsx`);

function Callback() {
  const [searchParams] = useSearchParams();
  const { updateToken } = useStoreToken();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    debug("Extracting token from the URL...");
    const token = searchParams.get("token");
    debug({ token });
    token && updateToken(token);
  }, [searchParams]);

  return <Navigate to="/" replace={true} />;
}

export default Callback;
