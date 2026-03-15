import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;
}
