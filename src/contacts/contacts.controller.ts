import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FindChatDto } from './dto/find-chat.dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { LocalRequestGuard } from 'src/utils/guards/local-request.guard';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({ summary: 'Update a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id') id: number, @Body() updateProviderDto: UpdateContactDto) {
    return this.contactsService.update(id, updateProviderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all contact' })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({
    summary: 'Retrieve a specific contact by ID',
  })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: number) {
    return this.contactsService.findOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a specific chat by userID and ProviderID',
  })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findChat(@Param() findChatDto: FindChatDto) {
    return this.contactsService.findChat(findChatDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({ summary: 'Delete a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: number) {
    return this.contactsService.remove(id);
  }
}
