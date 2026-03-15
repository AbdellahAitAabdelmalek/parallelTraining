import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryPort } from "@/features/user/ports/user.repository.port";
import { User } from "@/features/user/entities/user.entity";

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User profile not found");
    }
    return user;
  }
}
