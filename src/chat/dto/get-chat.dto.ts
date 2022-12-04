import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class GetChatDto {
    @IsNotEmpty()
    @IsNumber()
    receiverId: number;
  }
