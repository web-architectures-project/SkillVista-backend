import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindChatDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  provider_id: number;
}
