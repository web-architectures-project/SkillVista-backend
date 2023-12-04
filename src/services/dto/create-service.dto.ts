import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateServiceDto {
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
  @Min(0)
  @Max(1000000)
  pricing: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  availability: string;

  @ApiProperty({ required: true })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  date_created: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  service_image_url: string;
}
