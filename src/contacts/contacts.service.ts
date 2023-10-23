import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FindChatDto } from './dto/find-chat.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const { user_id, provider_id, who } = createContactDto;
    const whoEnum = ['user', 'service_provider'];

    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id },
    });
    if (!user) {
      throw new NotFoundException(`user ${user_id} is not found`);
    }

    const provider = await this.prisma.provider.findUnique({
      where: { provider_id: provider_id },
    });
    if (!provider) {
      throw new NotFoundException(`provider ${provider_id} is not found`);
    }

    if (!whoEnum.includes(who)) {
      throw new NotFoundException(`use user or service_provider for who `);
    }

    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  async findAll() {
    return this.prisma.contact.findMany();
  }

  async findChat(findChat: FindChatDto) {
    const { user_id, provider_id } = findChat;
    console.log(user_id);

    const contact = await this.prisma.contact.findMany({
      where: {
        AND: [
          { user_id: Number(user_id) },
          { provider_id: Number(provider_id) },
        ],
      },
    });
    if (!contact) {
      throw new NotFoundException(
        `Chatting${user_id} and ${provider_id} with is not found`,
      );
    }
    return { contact: contact, statusCode: 200 };
  }

  async findOne(id: number) {
    const contact_id = Number(id);
    const contact = await this.prisma.contact.findUnique({
      where: { contact_id: contact_id },
    });

    if (!contact) {
      throw new NotFoundException('Profile not found');
    }

    return { contact: contact, statusCode: 200 };
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact_id = Number(id);

    const { user_id, provider_id, who } = updateContactDto;
    const whoEnum = ['user', 'service_provider'];

    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id },
    });
    if (!user) {
      throw new NotFoundException(`user ${user_id} is not found`);
    }

    const provider = await this.prisma.provider.findUnique({
      where: { provider_id: provider_id },
    });
    if (!provider) {
      throw new NotFoundException(`provider ${provider_id} is not found`);
    }

    if (!whoEnum.includes(who)) {
      throw new NotFoundException(`use user or service_provider for who `);
    }

    return this.prisma.contact.update({
      where: { contact_id: contact_id },
      data: updateContactDto,
    });
  }

  async remove(id: number) {
    const contact_id = Number(id);

    const existingProfile = await this.prisma.contact.findUnique({
      where: { contact_id: contact_id },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.contact.delete({
      where: { contact_id: contact_id },
    });
  }
}
