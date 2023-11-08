import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encodePassword, decodePassword } from '../utils/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { AuthEntity } from './user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    public prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register API
  // This method is used to create a new user.

  async create(data: CreateUserDto) {
    try {
      const hashedPassword = encodePassword(data?.password);
      await this.prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          email: data.email,
          user_type: data.user_type,
          Profile: {
            create: {
              first_name: data.first_name,
              last_name: data.last_name,
              phone_number: data.phone_number,
              address: data.address,
              city: data.city,
              county: data.county,
              Eircode: data.Eircode,
            },
          },
        },
      });

      return HttpStatus.CREATED;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log({
            code: error.code,
            meta: error.meta?.target,
          });
          throw new HttpErrorByCode['409'](error.name);
        }
      }
    }
  }

  // Login API
  // This method is used to authenticate a user with their email and password.

  async loginWithUsernameAndPassword(data: LoginUserDto): Promise<AuthEntity> {
    try {
      const { email, password } = data;

      // Find a user with the provided email.
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new HttpErrorByCode['404']('User not found');
      }

      if (!decodePassword(password, user.password)) {
        throw new HttpErrorByCode['401']('Invalid password');
      }

      return {
        accessToken: this.jwtService.sign({ id: user?.user_id }),
      };
    } catch (error) {
      throw new HttpErrorByCode['500'](error);
    }
  }

  // Other API Endpoints

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new HttpErrorByCode['404']('User not found');
    }

    return user;
  }

  async returnUserIdFromToken(token: string) {
    const { id: userId } = this.jwtService.verify(token);

    return { userId: userId };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });

    if (!this.prisma.user) {
      throw new HttpErrorByCode['404']('User not found');
    }

    return HttpStatus.OK;
  }

  async remove(id: number) {
    const [removeUser, removeProfile] = await this.prisma.$transaction([
      this.prisma.user.delete({
        where: {
          user_id: id,
        },
      }),
      this.prisma.profile.delete({
        where: {
          profile_id: id,
        },
      }),
    ]);

    if (!removeUser && !removeProfile) {
      console.log('Something went wrong');
    }

    if (!this.prisma.user) {
      throw new HttpErrorByCode['404']('User not found');
    }

    return HttpStatus.OK;
  }
}
