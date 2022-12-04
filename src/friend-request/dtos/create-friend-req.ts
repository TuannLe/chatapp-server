import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFriendReq {
  @IsNotEmpty()
  @IsString()
  username: string;
}
