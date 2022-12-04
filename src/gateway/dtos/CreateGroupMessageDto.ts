import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupMessageDto {
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
