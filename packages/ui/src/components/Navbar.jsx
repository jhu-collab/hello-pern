import { useEffect } from "react";
import { Navbar as MantineNavbar, Text, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import User from "./User";
import Debug from "debug";
import useStoreLayout from "../hooks/useStoreLayout";

const debug = new Debug(`demo:components:Navbar.jsx`);

const items = [
  {
    name: "Demo",
  },
  {
    name: "Home",
    to: "/",
  },
  {
    name: "User",
  },
  {
    name: "Profile",
    to: "/profile",
  },
  {
    name: "Admin",
  },
  {
    name: "Users",
    to: "/admin/users",
  },
];

function Navbar() {
  const { openSidebar, toggleOpenSidebar } = useStoreLayout();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    debug(`Open sidebar? ${openSidebar}`);
  }, [openSidebar]);

  const handleOnClick = () => {
    debug("Close the sidebar if it was hidden...");
    toggleOpenSidebar(false);
  };

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!openSidebar}
      width={{ sm: 200, lg: 300 }}
    >
      <User />
      {items.map((item, index) => {
        return !item.to ? (
          <Divider key={index} my="xs" label={item.name} />
        ) : (
          <Text
            key={index}
            component={Link}
            variant="link"
            to={item.to}
            onClick={handleOnClick}
          >
            {item.name}
          </Text>
        );
      })}
    </MantineNavbar>
  );
}

export default Navbar;
