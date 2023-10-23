import { IsNotEmpty, IsInt, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class CreateContactDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  provider_id: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  message_content: string;

  @ApiProperty({ required: true })
  @IsEnum(UserType)
  @IsNotEmpty()
  who: UserType;
}
