import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      this.prisma.service.create({
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
    return this.prisma.service.findMany();
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
      this.prisma.service.update({
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

  async remove(id: number) {
    try {
      this.prisma.service.delete({
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
