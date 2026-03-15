import { User } from "@/features/user/entities/user.entity";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
