import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsEnum,
  MaxLength,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Username Required' })
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Email Required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({ required: true })
  @IsStrongPassword({}, { message: 'Password not strong enough' })
  @IsString()
  @IsNotEmpty({ message: 'Password Required' })
  password: string;

  @ApiProperty({ required: true })
  @IsEnum(UserType, { message: 'Invalid User Type' })
  @IsNotEmpty({ message: 'First Name Required' })
  user_type: UserType;

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
