import { Injectable } from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceTypeDto: CreateServiceTypeDto) {
    return this.prisma.serviceCategory.create({
      data: createServiceTypeDto,
    });
  }

  findAll() {
    return this.prisma.serviceCategory.findMany();
  }

  findOne(id: number) {
    const serviceType = this.prisma.serviceCategory.findUnique({
      where: { service_category_id: id },
    });
    return serviceType;
  }

  update(id: number, updateServiceTypeDto: UpdateServiceTypeDto) {
    return this.prisma.serviceCategory.update({
      where: { service_category_id: id },
      data: updateServiceTypeDto,
    });
  }

  remove(id: number) {
    return this.prisma.serviceCategory.delete({
      where: { service_category_id: id },
    });
  }
}
