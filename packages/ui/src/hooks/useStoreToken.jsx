import create from "zustand";
import { persist } from "zustand/middleware";
import Debug from "debug";

const debug = new Debug(`demo:hooks:useStoreToken.js`);

const useStoreToken = create(
  persist(
    (set) => ({
      token: "",
      updateToken: (value) => {
        debug("Updating the token...");
        set({ token: value });
      },
    }),
    {
      name: "demo:auth",
      getStorage: () => localStorage,
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);

export default useStoreToken;
