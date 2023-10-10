import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ required: false })
  username: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  password: string;
}
