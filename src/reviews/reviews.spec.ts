import { Test } from '@nestjs/testing/test';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TestingModule } from '@nestjs/testing/testing-module';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: jest.Mocked<ReviewsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review and return it', async () => {
      const dto = new CreateReviewDto();
      const result = { review_id: 1, ...dto };
      service.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should retrieve all reviews and return them', async () => {
      const dto = new CreateReviewDto();
      const result = [
        {
          review_id: 1,
          ...dto,
        },
        {
          review_id: 2,
          ...dto,
        },
      ];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should retrieve a review by ID and return it', async () => {
      const dto = new UpdateReviewDto();
      const result = { review_id: 1, ...dto };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a review by ID and return the updated review', async () => {
      const dto = new UpdateReviewDto();
      const result = { review_id: 1, ...dto };
      service.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a service by ID', async () => {
      const dto = new UpdateReviewDto();
      const result = { review_id: 1, ...dto };
      service.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});
