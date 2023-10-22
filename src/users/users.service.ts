import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encodePassword, decodePassword } from '../utils/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class UsersService {
  constructor(public prisma: PrismaService) {}

  // Register API
  // This method is used to create a new user.

  async create(data: CreateUserDto) {
    try {
      // Hash the user's password using the encodePassword function.
      data.password = encodePassword(data?.password);
      // Create a new user with the provided data.
      await this.prisma.user.create({
        data: data,
      });
      return HttpStatus.CREATED;
    } catch (error) {
      return new HttpErrorByCode['500'](error);
    }
  }

  // Login API
  // This method is used to authenticate a user with their email and password.

  async loginWithUsernameAndPassword(data: LoginUserDto) {
    try {
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
        return matched;
      }
    } catch (error) {
      return new HttpErrorByCode['500'](error);
    }
  }

  // Other API Endpoints

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });
    return HttpStatus.OK;
  }

  async remove(id: number) {
    this.prisma.user.delete({
      where: {
        user_id: id,
      },
    });
    return HttpStatus.OK;
  }
}
