import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  users: number[];

  @IsString()
  title: string;

  @IsString()
  avatar: string;
}
