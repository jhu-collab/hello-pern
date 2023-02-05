import { useEffect } from "react";
import { Alert, Title, Text } from "@mantine/core";
import { TbAlertCircle } from "react-icons/tb";
import Debug from "debug";

const debug = new Debug(`demo:pages:NotAllowed.jsx`);

function NotAllowed() {
  useEffect(() => {
    debug("Component mounted!");
  }, []);

  return (
    <Alert icon={<TbAlertCircle size={16} />} title="Bummer!" color="red">
      <Title order={1}>403</Title>
      <Text transform="uppercase">
        You are not authorized to access this page!
      </Text>
    </Alert>
  );
}

export default NotAllowed;
