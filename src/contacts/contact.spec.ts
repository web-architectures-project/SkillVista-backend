import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '@prisma/client';

const mockPrismaService = () => ({
  contact: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  provider: {
    findUnique: jest.fn(),
  },
});

describe('ContactsService', () => {
  let service: ContactsService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should successfully create a contact', async () => {
      const mockContact = {
        user_id: 1,
        provider_id: 2,
        message_content: 'Hello',
        who: UserType.user,
      };

      prisma.user.findUnique.mockResolvedValue(true);
      prisma.provider.findUnique.mockResolvedValue(true);
      prisma.contact.create.mockResolvedValue(mockContact);

      const result = await service.create(mockContact);
      expect(result).toEqual(201);
    });
  });

  describe('findAll', () => {
    it('should fetch all contacts', async () => {
      const mockContacts = [
        { user_id: 1, provider_id: 2, message_content: 'Hello', who: 'user' },
      ];

      prisma.contact.findMany.mockResolvedValue(mockContacts);

      const result = await service.findAll();
      expect(result).toEqual(mockContacts);
    });
  });

  describe('findOne', () => {
    it('should fetch one contact', async () => {
      const mockContact = {
        user_id: 1,
        provider_id: 2,
        message_content: 'Hello',
        who: 'user',
        contact_id: 1,
      };

      prisma.contact.findUnique.mockResolvedValue(mockContact);

      const result = await service.findOne(1);
      expect(result).toEqual(mockContact);
    });

    it('should throw an error if contact is not found', async () => {
      prisma.contact.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Profile not found');
    });
  });

  describe('update', () => {
    it('should update and return the updated contact', async () => {
      const mockUpdatedContact = {
        user_id: 1,
        provider_id: 2,
        message_content: 'Hello',
        who: UserType.service_provider,
      };

      prisma.user.findUnique.mockResolvedValue(true);
      prisma.provider.findUnique.mockResolvedValue(true);
      prisma.contact.update.mockResolvedValue(mockUpdatedContact);

      const result = await service.update(1, mockUpdatedContact);
      expect(result).toEqual(200);
    });
  });

  describe('remove', () => {
    it('should successfully delete a contact', async () => {
      const mockContact = {
        user_id: 1,
        provider_id: 2,
        message_content: 'Hello',
        who: 'user',
      };

      prisma.contact.findUnique.mockResolvedValue(mockContact);
      prisma.contact.delete.mockResolvedValue(mockContact);

      const result = await service.remove(1);
      expect(result).toEqual(200);
    });

    it('should throw an error if contact to be deleted is not found', async () => {
      prisma.contact.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow('Profile not found');
    });
  });
});
