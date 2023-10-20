import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceTypeDto: CreateServiceTypeDto) {
    try {
      this.prisma.serviceCategory.create({
        data: createServiceTypeDto,
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

  findAll() {
    return this.prisma.serviceCategory.findMany();
  }

  findOne(id: number) {
    try {
      const serviceType = this.prisma.serviceCategory.findUnique({
        where: { service_category_id: id },
      });
      return serviceType;
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

  update(id: number, updateServiceTypeDto: UpdateServiceTypeDto) {
    try {
      this.prisma.serviceCategory.update({
        where: { service_category_id: id },
        data: updateServiceTypeDto,
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

  remove(id: number) {
    try {
      this.prisma.serviceCategory.delete({
        where: { service_category_id: id },
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
