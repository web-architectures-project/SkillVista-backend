import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { service_id: id },
    });
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { service_id: id },
      data: updateServiceDto,
    });
  }

  async remove(id: number) {
    return this.prisma.service.delete({
      where: { service_id: id },
    });
  }
}
