import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ServiceTypesService } from './service_types.service';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { LocalRequestGuard } from '../utils/guards/local-request.guard';

@ApiTags('service-types')
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service type' })
  @ApiResponse({
    status: 201,
    description: 'Service type created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  create(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    return this.serviceTypesService.create(createServiceTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all service types' })
  @ApiResponse({ status: 200, description: 'Service types found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.serviceTypesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Service type ID' })
  @ApiOperation({ summary: 'Retrieve a specific service type by ID' })
  @ApiResponse({ status: 200, description: 'Service type found' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Service type ID' })
  @ApiOperation({ summary: 'Update a service type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service type updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    return this.serviceTypesService.update(+id, updateServiceTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Service type ID' })
  @ApiOperation({ summary: 'Delete a service type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service type deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: string) {
    return this.serviceTypesService.remove(+id);
  }
}
