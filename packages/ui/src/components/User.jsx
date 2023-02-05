import { useState, useEffect } from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import useAuth from "../hooks/useAuth";
import useQueryUser from "../hooks/useQueryUser";
import Debug from "debug";

const debug = new Debug(`demo:components:User.jsx`);

function User() {
  const [user, setUser] = useState({});
  const theme = useMantineTheme();
  const { data } = useQueryUser();
  const { signOut } = useAuth();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const openModal = () => {
    debug("Confirming logout..");
    openConfirmModal({
      centered: true,
      title: "Are you sure you want to sign out?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => signOut(),
    });
  };

  return (
    <Box>
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
        onClick={openModal}
      >
        <Group>
          <Avatar
            color={
              theme.colorScheme === "dark"
                ? theme.colors.blue[1]
                : theme.colors.blue[3]
            }
          >{`${user.firstName ? user.firstName[0] : ""}${
            user.lastName ? user.lastName[0] : ""
          }`}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Text transform="capitalize" size="sm" weight={500}>
              {`${user.firstName ? user.firstName : ""} ${
                user.lastName ? user.lastName : ""
              }`}
            </Text>
            <Text color="dimmed" size="xs">
              Click to sign out!
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
}

export default User;
