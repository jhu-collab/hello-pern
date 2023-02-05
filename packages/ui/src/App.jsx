import { lazy } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { Routes, Route } from "react-router-dom";
import Shell from "./layouts/Shell";
import useStoreTheme from "./hooks/useStoreTheme";
import Loadable from "./components/Loadable";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AdminOnlyRoute from "./layouts/AdminOnlyRoute";
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));
const Home = Loadable(lazy(() => import("./pages/demo/Home")));
const Login = Loadable(lazy(() => import("./pages/Login")));
const Callback = Loadable(lazy(() => import("./pages/Callback")));
const Profile = Loadable(lazy(() => import("./pages/Profile")));
const Users = Loadable(lazy(() => import("./pages/admin/Users")));

function App() {
  const { colorScheme, toggleColorScheme } = useStoreTheme();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider position="top-right">
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="login/callback" element={<Callback />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<Shell />}>
                  <Route path="" element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="admin/" element={<AdminOnlyRoute />}>
                    <Route path="users" element={<Users />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
