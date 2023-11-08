import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
