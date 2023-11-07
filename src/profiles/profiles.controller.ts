import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { LocalRequestGuard } from 'src/utils/guards/local-request.guard';
import { UserOwnershipGuard } from 'src/utils/guards/user-ownership.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profiles')
@Controller('profiles')
@UsePipes(new ValidationPipe())
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(201)
  create(@Body() createProfileDto: CreateProfileDto) {
    this.profilesService.create(createProfileDto);
    return HttpStatus.CREATED;
  }

  @Get()
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all profiles' })
  @ApiResponse({ status: 200, description: 'Profiles found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Res() res: Response) {
    const profiles = await this.profilesService.findAll();
    return res.status(HttpStatus.OK).json(profiles);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Retrieve a specific profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const userProfile = await this.profilesService.findOne(+id);
    return res.status(HttpStatus.OK).json(userProfile);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Update a profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({
    status: 400,
    description:
      'Foreign key constraint failed: Invalid user ID or relation constraint violated.',
  })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  update(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto) {
    this.profilesService.update(id, updateProfileDto);
    return HttpStatus.OK;
  }

  @Post('image/:id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Update a profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({
    status: 400,
    description:
      'Foreign key constraint failed: Invalid user ID or relation constraint violated.',
  })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateImage(@Param('id') id: number, @UploadedFile() file) {
    this.profilesService.updateImage(id, file);
    return HttpStatus.OK;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Delete a profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile removed successfully.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: number) {
    this.profilesService.remove(id);
    return HttpStatus.OK;
  }
}
