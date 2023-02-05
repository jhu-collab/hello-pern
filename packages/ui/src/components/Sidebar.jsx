import { useEffect } from "react";
import { Aside, MediaQuery, Text } from "@mantine/core";
import Debug from "debug";

const debug = new Debug(`demo:components:Sidebar.jsx`);

function Sidebar() {
  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        <Text>Application sidebar</Text>
      </Aside>
    </MediaQuery>
  );
}

export default Sidebar;
