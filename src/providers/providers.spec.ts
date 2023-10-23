import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import * as bcrypt from '../utils/bcrypt';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { LoginProviderDto } from './dto/login-provider.dto';

// Mock at the top-level, outside of any describe or function.
jest.mock('../utils/bcrypt');

describe('ProviderService', () => {
  let service: ProvidersService;
  let prismaMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      provider: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtServiceMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should create a provider successfully', async () => {
    const createProviderDto: CreateProviderDto = {
      email: 'test@example.com',
      username: 'testprovider',
      password: 'SKillvista208!',
    };

    prismaMock.provider.findFirst.mockResolvedValue(null);
    prismaMock.provider.create.mockResolvedValue({
      id: 1,
      ...createProviderDto,
    });

    const response = await service.create(createProviderDto);
    expect(response).toEqual({
      statusCode: 200,
      message: 'Register Successful',
    });
  });

  it('should return 302 if provider is already registered', async () => {
    const createProviderDto: CreateProviderDto = {
      email: 'test@example.com',
      username: 'testprovider',
      password: 'SKillvista208!',
    };

    prismaMock.provider.findFirst.mockResolvedValue({
      id: 1,
      ...createProviderDto,
    });

    await expect(service.create(createProviderDto)).rejects.toThrow(
      new HttpException('User already registered', 302),
    );
  });

  it('should login a provider successfully', async () => {
    const createProviderDto: LoginProviderDto = {
      email: 'test@example.com',
      password: 'SKillvista208!',
    };

    prismaMock.provider.findFirst.mockResolvedValue({
      id: 1,
      ...LoginProviderDto,
    });

    // Mock the bcrypt module
    jest.clearAllMocks();
    jest.spyOn(bcrypt, 'decodePassword').mockImplementation(() => true);

    const response = await service.login(createProviderDto);
    expect(response).toEqual({
      statusCode: 200,
      message: 'login successful',
    });
  });

  it('should return 403 if the password is incorrect', async () => {
    const LoginProviderDto: LoginProviderDto = {
      email: 'test@example.com',
      password: 'SKillwerwe18!',
    };

    prismaMock.provider.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'SKillvista208!',
    });

    jest.spyOn(bcrypt, 'decodePassword').mockImplementation(() => false);

    const response = await service.login(LoginProviderDto);
    expect(response).toEqual({
      statusCode: 403,
      message: 'wrong password',
    });
  });

  it('should return 400 if the provider is not found', async () => {
    const loginUserDto: LoginProviderDto = {
      email: 'notfound@example.com',
      password: 'SKilleeee208!',
    };

    prismaMock.provider.findFirst.mockResolvedValue(null);

    const response = await service.login(loginUserDto);
    expect(response).toEqual({
      statusCode: 400,
      message: 'user not found',
    });
  });
});
