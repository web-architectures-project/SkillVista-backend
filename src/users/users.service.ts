import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
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
    // Hash the user's password using the encodePassword function.
    data.password = encodePassword(data?.password);
    // Create a new user with the provided data.
    const createUser = await this.prisma.user.create({
      data: data,
    });
    return createUser;
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
      return matched;
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
    const user = this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: {
        user_id: id,
      },
    });
  }
}
