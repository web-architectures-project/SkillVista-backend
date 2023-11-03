import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

import { Response } from 'express';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { LocalRequestGuard } from 'src/utils/guards/local-request.guard';
import { FindChatDto } from './dto/find-chat.dto';

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
    this.contactsService.create(createContactDto);
    return HttpStatus.CREATED;
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
    this.contactsService.update(id, updateProviderDto);
    return HttpStatus.OK;
  }

  @Get()
  @UseGuards(JwtAuthGuard, LocalRequestGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all contact' })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Res() res: Response) {
    const contacts = await this.contactsService.findAll();
    return res.status(HttpStatus.OK).json(contacts);
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
  async indOne(@Param('id') id: number, @Res() res: Response) {
    const contact = await this.contactsService.findOne(id);
    return res.status(HttpStatus.OK).json(contact);
  }

  @Post('findChat')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a specific chat by userID and ProviderID',
  })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findChat(@Body() findChat: FindChatDto, @Res() res: Response) {
    const contact = await this.contactsService.findChat(findChat);
    return res.status(HttpStatus.OK).json(contact);
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
    this.contactsService.remove(id);
    return HttpStatus.OK;
  }
}
