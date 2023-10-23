import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginProviderDto } from './dto/login-provider.dto';

@ApiTags('providers')
@Controller('providers')
@UsePipes(new ValidationPipe())
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new providers' })
  @ApiResponse({ status: 201, description: 'Provider created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Provider login successfully' })
  @ApiResponse({ status: 201, description: 'Provider created successfully' })
  @ApiResponse({ status: 200, description: 'Provider found' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  loginProvider(@Body() loginProviderDto: LoginProviderDto) {
    return this.providersService.login(loginProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all provider' })
  @ApiResponse({ status: 200, description: 'Providers found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiOperation({ summary: 'Retrieve a specific provider by ID' })
  @ApiResponse({ status: 200, description: 'Provider found' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: number) {
    return this.providersService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiOperation({ summary: 'Update a provider by ID' })
  @ApiResponse({ status: 200, description: 'Provider updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(
    @Param('id') id: number,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiOperation({ summary: 'Delete a provider by ID' })
  @ApiResponse({ status: 200, description: 'Provider deleted successfully' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: number) {
    return this.providersService.remove(id);
  }
}
