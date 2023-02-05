import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  TextInput,
  Box,
  Group,
  Loader,
  Notification,
  useMantineTheme,
} from "@mantine/core";
import { TbX } from "react-icons/tb";
import useQueryUser from "../hooks/useQueryUser";
import Debug from "debug";

const debug = new Debug(`demo:pages:Profile.jsx`);

const schema = z.object({
  id: z.number().transform((val) => Number(val)),
  username: z.string().min(1, { message: "Username cannot be empty" }),
  firstName: z.string().min(1, { message: "First name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last name cannot be empty" }),
  email: z.string().email({ message: "Invalid email" }),
  role: z.string(),
});

function Profile() {
  const theme = useMantineTheme();
  const { isLoading, error, data } = useQueryUser();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      id: "0",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      form.setValues(data);
    }
  }, [isLoading, error, data]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Notification icon={<TbX size={18} />} color="red">
        {"An error has occurred: " + error.message}
      </Notification>
    );
  }

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          disabled
          label="Username"
          {...form.getInputProps("username")}
        />
        <TextInput
          disabled
          label="First Name"
          mt="sm"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          disabled
          label="Last Name"
          mt="sm"
          {...form.getInputProps("lastName")}
        />
        <TextInput
          disabled
          label="Email"
          mt="sm"
          {...form.getInputProps("email")}
        />
        <TextInput
          disabled
          label="Role"
          mt="sm"
          {...form.getInputProps("role")}
        />
      </form>
    </Box>
  );
}

export default Profile;
