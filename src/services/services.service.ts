import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      await this.prisma.service.create({
        data: createServiceDto,
      });
      return HttpStatus.CREATED;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `provider_id`',
        )
      ) {
        throw new NotFoundException('Provider not found');
      }
    }
  }

  async findAll() {
    return await this.prisma.service.findMany();
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { service_id: id },
      });
      return service;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `provider_id`',
        )
      ) {
        throw new NotFoundException('Provider not found');
      }
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      await this.prisma.service.update({
        where: { service_id: id },
        data: updateServiceDto,
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `provider_id`',
        )
      ) {
        throw new NotFoundException('Provider not found');
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
      await this.prisma.service.update({
        where: { service_id: id },
        data: { service_image_url: data.data.display_url },
      });
      return HttpStatus.OK;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.service.delete({
        where: { service_id: id },
      });
      return HttpStatus.OK;
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `provider_id`',
        )
      ) {
        throw new NotFoundException('Provider not found');
      }
    }
  }
}
