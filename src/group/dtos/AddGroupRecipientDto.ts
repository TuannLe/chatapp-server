import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddGroupRecipientDto {
  @IsNotEmpty()
  @IsNumber()
  recipientId: number;
}
