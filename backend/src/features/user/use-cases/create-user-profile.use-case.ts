import { ConflictException, Inject, Injectable } from "@nestjs/common";
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from "@/features/user/ports/user.repository.port";
import { User } from "@/features/user/entities/user.entity";

export interface CreateUserProfileInput {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

@Injectable()
export class CreateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: CreateUserProfileInput): Promise<User> {
    const existing = await this.userRepository.findById(input.id);
    if (existing) {
      throw new ConflictException("User profile already exists");
    }

    const user = new User({
      id: input.id,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth,
    });

    await this.userRepository.save(user);
    return user;
  }
}
