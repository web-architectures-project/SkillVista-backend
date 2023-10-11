import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { encodePassword, decodePassword } from 'src/utils/bcrypt';
import { compareSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Register API
  // This method is used to create a new user.

  async create(data: CreateUserDto) {
    // Check if the user with the same email already exists.
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (checkUserExists) {
      // If the user already exists, throw an HTTP exception.
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    // Hash the user's password using the encodePassword function.
    data.password = encodePassword(data?.password);

    // Create a new user with the provided data.
    const createUser = await this.prisma.user.create({
      data: data,
    });

    if (createUser) {
      // If the user is successfully created, return a success message.
      return {
        statusCode: 200,
        message: 'Register Successful',
      };
    }
  }

  // Login API
  // This method is used to authenticate a user with their email and password.

  async loginWithUsernameAndPassword(request, response) {
    const { query } = request;

    // Find a user with the provided email.
    const user = await this.prisma.user.findFirst({
      where: {
        email: query?.email,
      },
    });

    if (user) {
      // Decode and compare the provided password with the stored hashed password.
      const matched = decodePassword(query?.password, user?.password);

      if (matched) {
        // If the password matches, send a success response.
        response.status(HttpStatus.OK).send('Login Successful');
      } else {
        // If the password doesn't match, send a forbidden response.
        response.status(HttpStatus.FORBIDDEN).send('Wrong Password');
      }
    }
  }

  // Other API Endpoints

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
