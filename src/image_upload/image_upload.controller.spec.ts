import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadController } from './image_upload.controller';
import { ImageUploadService } from './image_upload.service';

describe('ImageUploadController', () => {
  let controller: ImageUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploadController],
      providers: [ImageUploadService],
    }).compile();

    controller = module.get<ImageUploadController>(ImageUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
