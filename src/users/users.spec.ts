import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
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
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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
      userType: 'user',
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, ...createUserDto });

    const response = await service.create(createUserDto);
    expect(response).toEqual(201);
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
    expect(response).toEqual(200);
  });

  it('should return all users when requested', async () => {
    const users = [
      {
        id: 1,
        email: '',
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(users);
    const response = await service.findAll();
    expect(response).toEqual(users);
  });

  it('should return a user when requested', async () => {
    const user = {
      id: 1,
      email: '',
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    const response = await service.findOne(1);
    expect(response).toEqual(user);
  });

  it('should return a status 200 when a user is updated', async () => {
    const updateUserDto = {
      email: ' ',
    };

    prismaMock.user.update.mockResolvedValue(updateUserDto);
    const response = await service.update(1, updateUserDto);
    expect(response).toEqual(200);
  });

  it('should return a status 200 when a user is deleted', async () => {
    prismaMock.user.delete.mockResolvedValue({});
    const response = await service.remove(1);
    expect(response).toEqual(200);
  });
});
