import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from '../utils/bcrypt'; // Import the whole module

// Mock at the top-level, outside of any describe or function.
jest.mock('../utils/bcrypt');

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

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpass',
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, ...createUserDto });

    const response = await service.create(createUserDto);
    expect(response).toEqual({
      statusCode: 200,
      message: 'Register Successful',
    });
  });

  it('should return 302 if user is already registered', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpass',
    };

    prismaMock.user.findFirst.mockResolvedValue({ id: 1, ...createUserDto });

    await expect(service.create(createUserDto)).rejects.toThrow(
      new HttpException('User already registered', 302),
    );
  });

  it('should login a user successfully', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'testpass',
    };

    prismaMock.user.findFirst.mockResolvedValue({ id: 1, ...loginUserDto });

    // Mock the bcrypt module
    jest.clearAllMocks();
    jest.spyOn(bcrypt, 'decodePassword').mockImplementation(() => true);

    const response = await service.loginWithUsernameAndPassword(loginUserDto);
    expect(response).toEqual({
      statusCode: 200,
      message: 'login successful',
    });
  });

  it('should return 403 if the password is incorrect', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'wrongpass', // purposefully incorrect password
    };

    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'testpass',
    });

    jest.spyOn(bcrypt, 'decodePassword').mockImplementation(() => false); // password doesn't match

    const response = await service.loginWithUsernameAndPassword(loginUserDto);
    expect(response).toEqual({
      statusCode: 403,
      message: 'Wrong Password',
    });
  });

  it('should return 400 if the user is not found', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'notfound@example.com',
      password: 'somepass',
    };

    prismaMock.user.findFirst.mockResolvedValue(null); // no user found

    const response = await service.loginWithUsernameAndPassword(loginUserDto);
    expect(response).toEqual({
      statusCode: 400,
      message: 'user not found',
    });
  });
});
