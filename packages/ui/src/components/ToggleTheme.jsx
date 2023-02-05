import { useEffect } from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { TbSun, TbMoonStars } from "react-icons/tb";
import Debug from "debug";

const debug = new Debug(`demo:components:ToggleTheme.jsx`);

function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  useEffect(() => {
    debug("Component mounted");
  }, []);

  const handleOnClick = () => {
    debug("Toggle color theme...");
    toggleColorScheme();
  };

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={handleOnClick}
      title="Toggle color scheme"
    >
      {dark ? <TbSun size={18} /> : <TbMoonStars size={18} />}
    </ActionIcon>
  );
}

export default ToggleTheme;
