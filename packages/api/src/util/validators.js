import { z } from "zod";

export const usernameSchema = z
  .string({
    required_error: "username is required",
    invalid_type_error: "username must be a string",
  })
  .regex(/[a-zA-Z0-9._-]+/, {
    message:
      "Username may contain letters, numbers, dash, dot, and underscore characters only!",
  })
  .min(1, { message: "Username cannot be empty!" })
  .transform((str) => str.toLowerCase().trim());

export const emailSchema = z
  .string({
    required_error: "email is required",
    invalid_type_error: "email must be a string",
  })
  .email({ message: "Invalid email address!" })
  .transform((str) => str.toLowerCase().trim());

export const requestIdSchema = z
  .number({
    required_error: "Request ID must be provided",
    invalid_type_error: "Request ID must be a number",
  })
  .positive({ message: "Request ID must be a positive integer" });
