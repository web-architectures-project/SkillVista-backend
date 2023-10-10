import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtServiceMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'testpass',
      username: 'testuser',
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, ...createUserDto });

    const response = await service.create(createUserDto);
    expect(response).toEqual({
      statusCode: 200,
      message: 'Register Successfull',
    });
  });

  it('should throw an error if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'testpass',
      username: 'testuser',
    };

    prismaMock.user.findFirst.mockResolvedValue({ id: 1, ...createUserDto });

    await expect(service.create(createUserDto)).rejects.toThrow(
      new HttpException('User already registered', 302),
    );
  });
});
