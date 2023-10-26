import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      await this.prisma.review.create({
        data: createReviewDto,
      });
      return HttpStatus.CREATED;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `service_id`',
        )
      ) {
        throw new NotFoundException('Service not found');
      }
    }
  }

  async findAll() {
    return await this.prisma.review.findMany();
  }

  async findOne(id: number) {
    try {
      const review = await this.prisma.review.findUnique({
        where: { review_id: id },
      });
      return review;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `service_id`',
        )
      ) {
        throw new NotFoundException('Service not found');
      }
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      await this.prisma.review.update({
        where: { review_id: id },
        data: updateReviewDto,
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `service_id`',
        )
      ) {
        throw new NotFoundException('Service not found');
      }
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.review.delete({
        where: { review_id: id },
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `service_id`',
        )
      ) {
        throw new NotFoundException('Service not found');
      }
    }
  }
}
