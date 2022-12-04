import { IsString } from 'class-validator';

export class UpdateGroupDetalDto {
  @IsString()
  title: string;

  @IsString()
  avatar: string;
}
