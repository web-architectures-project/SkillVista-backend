import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      await this.prisma.profile.create({
        data: createProfileDto,
      });
      return HttpStatus.CREATED;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `user_id`',
        )
      ) {
        throw new BadRequestException('User not found');
      }
    }
  }

  async findAll() {
    return await this.prisma.profile.findMany();
  }

  async findOne(profile_id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        profile_id: profile_id,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(id: number, updateReviewDto: CreateProfileDto) {
    try {
      await this.prisma.profile.update({
        where: { profile_id: id },
        data: updateReviewDto,
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `user_id`',
        )
      ) {
        throw new NotFoundException('User not found');
      }
    }
  }

  async remove(profile_id: number) {
    try {
      await this.prisma.profile.delete({
        where: { profile_id: profile_id },
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `user_id`',
        )
      ) {
        throw new NotFoundException('User not found');
      }
    }
  }
}
