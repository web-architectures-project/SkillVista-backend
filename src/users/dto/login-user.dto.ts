import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto {
  @ApiProperty({ required: false })
  username: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  password: string;
}
