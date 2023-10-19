import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
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
}
