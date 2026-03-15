import { IsString, IsNotEmpty } from "class-validator";

export class SuggestDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}
