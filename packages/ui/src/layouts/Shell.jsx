import { useEffect } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
import Debug from "debug";

const debug = new Debug(`demo:layouts:Shell.jsx`);

function Shell() {
  const theme = useMantineTheme();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<Navbar />}
      // aside={<Sidebar />}
      footer={<Footer />}
      header={<Header />}
    >
      <Outlet />
    </AppShell>
  );
}

export default Shell;
