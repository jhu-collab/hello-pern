import { useEffect } from "react";
import {
  Header as MantineHeader,
  Text,
  MediaQuery,
  Burger,
  Group,
  useMantineTheme,
} from "@mantine/core";
import ToggleTheme from "./ToggleTheme";
import useStoreLayout from "../hooks/useStoreLayout";
import { useLocation } from "react-router-dom";
import Debug from "debug";

const debug = new Debug(`demo:components:Header.jsx`);

function AppTitle() {
  return (
    <MediaQuery smallerThan={250} styles={{ display: "none" }}>
      <Text transform="capitalize" weight={500} size="lg">
        Demo App
      </Text>
    </MediaQuery>
  );
}

function BurgerMenu() {
  const theme = useMantineTheme();
  const { openSidebar, toggleOpenSidebar } = useStoreLayout();

  useEffect(() => {
    debug(`Open sidebar? ${openSidebar}`);
  }, [openSidebar]);

  const handleOnClick = () => {
    debug("Toggle open side bar...");
    toggleOpenSidebar();
  };

  return (
    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      <Burger
        opened={openSidebar}
        onClick={handleOnClick}
        size="sm"
        color={theme.colors.gray[6]}
        mr="xl"
      />
    </MediaQuery>
  );
}

function Header() {
  const location = useLocation();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  const notOnLoginPage = () => location.pathname !== "/login";

  return (
    <MantineHeader height={70} p="md">
      <Group position="apart" style={{ height: "100%" }} spacing="xs">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {notOnLoginPage() && <BurgerMenu />}
          <AppTitle />
        </div>
        <ToggleTheme />
      </Group>
    </MantineHeader>
  );
}

export default Header;
