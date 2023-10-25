import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsEnum,
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
  userType: UserType;
}
