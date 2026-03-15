import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
});

export const usersContract = c.router({
  createProfile: {
    method: "POST",
    path: "/users/profile",
    body: z.object({
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z.string(),
    }),
    responses: {
      201: UserSchema,
    },
  },
  getProfile: {
    method: "GET",
    path: "/users/profile",
    responses: {
      200: UserSchema,
    },
  },
});

export type User = z.infer<typeof UserSchema>;
