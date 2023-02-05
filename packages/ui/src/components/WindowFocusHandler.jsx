import { useEffect } from "react";
import { Text, Button } from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import useAuth from "../hooks/useAuth";
import Debug from "debug";

const debug = new Debug(`demo:components:WindowFocusHandler.jsx`);

function WindowFocusHandler() {
  const { isTokenExpired, signOut } = useAuth();

  useEffect(() => {
    debug("adding event listener to window focus");
    window.addEventListener("focus", onFocus);
    return () => {
      debug("removing event listener to window focus");
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const onCloseHandler = () => {
    signOut();
    closeAllModals();
  };

  const onFocus = () => {
    if (isTokenExpired()) {
      openModal({
        onClose: onCloseHandler,
        withCloseButton: false,
        closeOnClickOutside: false,
        centered: true,
        closeOnEscape: false,
        trapFocus: true,
        lockScroll: true,
        title: "Your authentication token has expired!",
        children: (
          <>
            <Text>Please sign in again!</Text>
            <Button fullWidth onClick={onCloseHandler} mt="md">
              Okay!
            </Button>
          </>
        ),
      });
    }
  };

  return <></>;
}

export default WindowFocusHandler;
