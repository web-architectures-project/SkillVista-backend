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
} from '@nestjs/common';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
@UsePipes(new ValidationPipe())
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(201)
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all profiles' })
  @ApiResponse({ status: 200, description: 'Profiles found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Retrieve a specific profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findOne(@Param('id') id: number) {
    return this.profilesService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @UsePipes(new ValidationPipe())
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
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Delete a profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile removed successfully.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: number) {
    return this.profilesService.remove(id);
  }
}
