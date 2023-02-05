import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Container,
  Center,
  Stack,
  Space,
} from "@mantine/core";
import { z } from "zod";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import Debug from "debug";

const debug = new Debug(`demo:pages:Login.jsx`);

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function Login(props) {
  const [viteRunMode] = useState(import.meta.env.VITE_RUN_MODE);
  const { isAuthenticated, signIn, signInAsUser, signInAsAdmin } = useAuth();
  const { height } = useViewportSize();
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  if (isAuthenticated()) {
    debug("Redirect to home...");
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      <Header />
      <Container size="xs" px="xs">
        <Center style={{ height: `${height - 140}px` }}>
          <Paper
            radius="md"
            p="xl"
            withBorder
            {...props}
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            {/* <Text size="lg" weight={500}>
              Welcome!
            </Text>
            <Space h="md" /> */}

            {viteRunMode === "local" && (
              <>
                <Stack>
                  <Button onClick={() => signInAsUser()}>
                    Sign in as User
                  </Button>
                  <Button onClick={() => signInAsAdmin()}>
                    Sign in as Admin
                  </Button>
                </Stack>
                <Divider
                  label="Or continue with"
                  labelPosition="center"
                  my="lg"
                />
              </>
            )}

            <form onSubmit={form.onSubmit((values) => signIn(values))}>
              <Stack>
                <TextInput
                  required
                  label="Username"
                  placeholder="your username"
                  {...form.getInputProps("username")}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  autoComplete="new-password"
                  {...form.getInputProps("password")}
                />

                <Group position="apart" spacing="xs">
                  <Text
                    size="xs"
                    style={{ maxWidth: "15vw", minWidth: "160px" }}
                    sx={(theme) => ({
                      // subscribe to color scheme changes
                      color:
                        theme.colorScheme === "dark"
                          ? theme.colors.pink[1]
                          : theme.colors.pink[8],
                    })}
                  >
                    {viteRunMode === "prod"
                      ? "Use the demo username and password provided to you by Dr. Madooei."
                      : "Use the user credentials from the database seeder script!"}
                  </Text>
                  <Button type="submit">Login</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Center>
      </Container>
      <Footer />
    </div>
  );
}

export default Login;
