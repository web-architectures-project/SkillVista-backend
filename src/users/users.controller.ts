import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Register controllers

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async loginWithUsernameAndPassword(
    @Body() userData: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const token = await this.usersService.loginWithUsernameAndPassword(
        userData,
      );
      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // Login controllers

  @Post('login')
  loginWithUsernameAndPassword(@Body() userData: CreateUserDto) {
    return this.usersService.loginWithUsernameAndPassword(userData);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) throw new Error('User not found');
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
