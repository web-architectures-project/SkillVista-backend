import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

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

  async update(id: number, updateReviewDto: UpdateProfileDto) {
    try {
      const userProfile = await this.prisma.profile.findUnique({
        where: { profile_id: id },
      });
      if (!userProfile) {
        throw new NotFoundException('Profile not found');
      }

      await this.prisma.profile.update({
        where: { profile_id: id },
        data: { ...updateReviewDto },
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

  async updateImage(id: number, file: Express.Multer.File) {
    try {
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?expiration=600&key=52b240069ac7e51df93d0e1de36360de`,
            formData,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );
      await this.prisma.profile.update({
        where: { profile_id: id },
        data: { profile_picture_url: data.data.display_url },
      });
      return HttpStatus.OK;
    } catch (error) {
      console.log(error);
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
