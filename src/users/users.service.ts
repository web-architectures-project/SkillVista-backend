import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encodePassword, decodePassword } from '../utils/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(public prisma: PrismaService) {}

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

  async loginWithUsernameAndPassword(data: LoginUserDto) {
    const { email, password } = data;

    // Find a user with the provided email.
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      // Decode and compare the provided password with the stored hashed password.
      const matched = decodePassword(password, user?.password);
      if (matched) {
        return {
          statusCode: 200,
          message: 'login successful',
        };
      } else {
        // If the password doesn't match, send a forbidden response.
        return {
          statusCode: 403,
          message: 'Wrong Password',
        };
      }
    } else {
      return {
        statusCode: 400,
        message: 'user not found',
      };
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
