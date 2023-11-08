import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Res,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { LocalRequestGuard } from 'src/utils/guards/local-request.guard';
import { UserOwnershipGuard } from 'src/utils/guards/user-ownership.guard';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Register controllers

  @Post('register')
  @ApiOperation({ summary: 'Create a new User' })
  @ApiResponse({ status: 201, description: 'User create succesfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.create(createUserDto);

      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User logged in succesfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async loginWithUsernameAndPassword(
    @Body() userData: LoginUserDto,
    @Res() res: Response,
  ) {
    try {
      const token =
        await this.usersService.loginWithUsernameAndPassword(userData);
      return res.status(HttpStatus.OK).json(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'User data returned Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'user not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('validate/:token')
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate a user' })
  @ApiResponse({ status: 200, description: 'User data returned Successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async validate(@Res() res: Response, @Param('token') token: string) {
    try {
      const validatedToken =
        await this.usersService.returnUserIdFromToken(token);
      return res.status(HttpStatus.OK).json(validatedToken);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single user' })
  @ApiResponse({ status: 200, description: 'User returned successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(+id);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the user' })
  @ApiResponse({ status: 201, description: 'User updated succesfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = this.usersService.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 201, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      this.usersService.remove(id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
