import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core";
import { type InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserRow = InferSelectModel<typeof users>;
export type NewUserRow = InferInsertModel<typeof users>;
