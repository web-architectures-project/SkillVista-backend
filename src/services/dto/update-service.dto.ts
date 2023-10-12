import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  provider_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  service_type_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  description: string;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  @Matches(/^\d{0,8}(\.\d{1,4})?$/, {
    message: 'Invalid price',
  })
  pricing: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  availability: string;

  @ApiProperty({ required: true })
  @IsDate()
  @IsNotEmpty()
  date_created: Date;
}
