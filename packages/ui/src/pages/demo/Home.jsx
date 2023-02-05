import { useEffect } from "react";
import { Text, Loader, Badge, Paper, Code } from "@mantine/core";
import { BASE_URL } from "../../hooks/helper";
import useQueryBackend from "../../hooks/useQueryBackend";
import Debug from "debug";

const debug = new Debug(`demo:pages:demo:Home.jsx`);

function Home() {
  const { isLoading, error, data } = useQueryBackend();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    isLoading
      ? debug("Trying to connect to API!")
      : error
      ? debug("Error connecting to the API!")
      : debug("Connected to the API!");
  }, [isLoading, error, data]);

  if (isLoading) return <Loader />;

  return (
    <Paper shadow="xs" radius="lg" p="xl">
      <Text size="xl" transform="uppercase">
        Welcome to this demo app!
      </Text>
      <Text>
        API Server at <Code>{BASE_URL}</Code>
        {" is "}
        {error ? (
          <Badge color="red">broken!</Badge>
        ) : (
          <Badge color="green">connected!</Badge>
        )}
      </Text>
    </Paper>
  );
}

export default Home;
