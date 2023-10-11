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

  // All code for Register API

  async create(data: CreateUserDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    // Kaustubh - "I have changed some code here to make hashing and checking the hashed password for login a little bit easier".

    data.password = encodePassword(data?.password);
    const createUser = await this.prisma.user.create({
      data: data,
    });
    if (createUser) {
      return {
        statusCode: 200,
        message: 'Register Successfulll',
      };
    }
  }

  // All code for login API

  async loginWithUsernameAndPassword(request, response) {
    const { query } = request;
    const user = await this.prisma.user.findFirst({
      where: {
        email: query?.email,
      },
    });
    if (user) {
      const matched = decodePassword(query?.password, user?.password);
      console.log(matched);
      if (matched) {
        response.status(HttpStatus.OK).send('Login successfull');
      } else {
        response.status(HttpStatus.FORBIDDEN).send('Wrong Password');
      }
    }
  }

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
