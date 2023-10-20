import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = () => ({
  user: {
    findUnique: jest.fn(),
  },
  profile: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ user_id: 1 });
      prisma.profile.findUnique.mockResolvedValue(null);
      prisma.profile.create.mockResolvedValue({
        user_id: 1,
        first_name: 'Test',
        last_name: 'Doe',
      });

      const result = await service.create({
        user_id: 1,
        first_name: 'Test',
        last_name: 'Doe',
        phone_number: '1234567890',
        address: '123 Main St',
        city: 'City',
        county: 'County',
        Eircode: '12345',
      });

      expect(result).toEqual(201);
    });
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      const profile = { user_id: 1, first_name: 'Test' };
      prisma.profile.findMany.mockResolvedValue([profile]);
      expect(await service.findAll()).toEqual([profile]);
    });

    describe('findOne', () => {
      it('should retrieve a profile successfully by ID', async () => {
        const profile = { user_id: 1, first_name: 'Test' };
        prisma.profile.findUnique.mockResolvedValue(profile);

        const result = await service.findOne(1);

        expect(result).toEqual(profile);
      });
    });

    describe('update', () => {
      it('should update a profile successfully', async () => {
        const profile = { user_id: 1, first_name: 'Test', last_name: 'Doe' };
        prisma.profile.findUnique.mockResolvedValue(profile);
        prisma.profile.update.mockResolvedValue({
          ...profile,
          first_name: 'Updated',
        });

        const result = await service.update(1, {
          first_name: 'Updated',
          last_name: 'Doe',
          phone_number: '1234567890',
          address: '123 Main St',
          city: 'City',
          county: 'County',
          Eircode: '12345',
          user_id: 0,
        });

        expect(result).toEqual(200);
      });

      describe('remove', () => {
        it('should remove a profile successfully', async () => {
          const profile = { user_id: 1, first_name: 'Test', last_name: 'Doe' };
          prisma.profile.findUnique.mockResolvedValue(profile);
          prisma.profile.delete.mockResolvedValue(profile);

          const result = await service.remove(1);

          expect(result).toEqual(200);
        });
      });
    });
  });
});
