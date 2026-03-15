import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { UserRepositoryPort } from "../../domain/user/ports/user.repository.port";
import { User } from "../../domain/user/entities/user.entity";
import { DRIZZLE_DB, DrizzleDb } from "./drizzle.provider";
import { users } from "./schemas/user-schema";

@Injectable()
export class DrizzleUserRepository implements UserRepositoryPort {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return new User({
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: new Date(row.dateOfBirth),
      createdAt: row.createdAt,
    });
  }

  async save(user: User): Promise<void> {
    await this.db.insert(users).values({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth.toISOString().split("T")[0],
    });
  }
}
