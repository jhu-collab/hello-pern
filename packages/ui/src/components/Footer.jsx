import { useState, useEffect } from "react";
import {
  Footer as MantineFooter,
  Text,
  Group,
  Badge,
  MediaQuery,
} from "@mantine/core";
import Debug from "debug";

const debug = new Debug(`demo:components:Footer.jsx`);

function EnvBadge({ label }) {
  return (
    <MediaQuery smallerThan={300} styles={{ display: "none" }}>
      <Badge>{label}</Badge>
    </MediaQuery>
  );
}

function Footer() {
  const [viteRunMode] = useState(import.meta.env.VITE_RUN_MODE);

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return (
    <MantineFooter height={60} p="md">
      <Group position="apart" style={{ height: "100%" }} spacing="xs">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Text transform="capitalize" weight={500} size="lg">
            Collab @ JHU
          </Text>
        </div>
        {viteRunMode === "local" ? (
          <EnvBadge label="Dev (Local)" />
        ) : viteRunMode === "dev" ? (
          <EnvBadge label="Dev (Staging)" />
        ) : (
          <></>
        )}
      </Group>
    </MantineFooter>
  );
}

export default Footer;
