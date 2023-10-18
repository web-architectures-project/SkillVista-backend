import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  service_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  reviewer_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  @Length(1, 5)
  rating: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  comment: string;

  @ApiProperty({ required: true })
  @IsDate()
  @IsNotEmpty()
  date_posted: Date;
}
