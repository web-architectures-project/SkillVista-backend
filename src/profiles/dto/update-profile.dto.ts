import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
  Length,
  IsString,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  first_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  last_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: 'Invalid phone number',
  })
  phone_number: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  county: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(7, 8)
  Eircode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  profile_picture_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
