import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { decodePassword, encodePassword } from 'src/utils/bcrypt';
import { LoginProviderDto } from './dto/login-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(createProviderDto: CreateProviderDto) {
    const checkProviderExsits = await this.prisma.provider.findFirst({
      where: {
        email: createProviderDto.email,
      },
    });

    if (checkProviderExsits) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    createProviderDto.password = encodePassword(createProviderDto?.password);

    const createProvider = await this.prisma.provider.create({
      data: createProviderDto,
    });

    if (createProvider) {
      return {
        statusCode: 200,
        message: 'Register Successful',
      };
    }
  }

  async login(createProviderDto: LoginProviderDto) {
    const { email, password } = createProviderDto;

    const provider = await this.prisma.provider.findFirst({
      where: {
        email: email,
      },
    });

    if (provider) {
      const matched = decodePassword(password, provider?.password);
      if (matched) {
        return {
          statusCode: 200,
          message: 'login successful',
        };
      } else {
        return {
          statusCode: 403,
          message: 'wrong password',
        };
      }
    } else {
      return {
        statusCode: 400,
        message: 'user not found',
      };
    }
  }

  async findAll() {
    return await this.prisma.provider.findMany();
  }

  async findOne(provider_id: number) {
    provider_id = Number(provider_id);

    const provider = await this.prisma.provider.findUnique({
      where: { provider_id: provider_id },
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return { provider: provider, statusCode: 200 };
  }

  async update(provider_id: number, updateProviderDto: UpdateProviderDto) {
    provider_id = Number(provider_id);
    const existingProvider = await this.prisma.provider.findUnique({
      where: { provider_id: provider_id },
    });
    if (!existingProvider) {
      throw new NotFoundException(`Provider with ID ${provider_id} not found.`);
    }

    await this.prisma.provider.update({
      where: { provider_id: provider_id },
      data: updateProviderDto,
    });
    return { message: 'Provider updated successfully', statusCode: 200 };
  }

  async remove(provider_id: number) {
    provider_id = Number(provider_id);

    const existingProvider = await this.prisma.provider.findUnique({
      where: { provider_id: provider_id },
    });

    if (!existingProvider) {
      throw new NotFoundException('Provider not found');
    }

    await this.prisma.provider.delete({
      where: { provider_id: provider_id },
    });
    return { message: 'Provider removed successfully', statusCode: 200 };
  }
}
