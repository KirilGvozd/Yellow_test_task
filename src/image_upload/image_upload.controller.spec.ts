import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadController } from './image_upload.controller';
import { ImageUploadService } from './image_upload.service';
import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

describe('ImageUploadController', () => {
  let controller: ImageUploadController;
  let service: ImageUploadService;

  const mockImageUploadService = {
    uploadImage: jest.fn(),
    getImages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploadController],
      providers: [
        {
          provide: ImageUploadService,
          useValue: mockImageUploadService,
        },
      ],
    }).compile();

    controller = module.get<ImageUploadController>(ImageUploadController);
    service = module.get<ImageUploadService>(ImageUploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should return a success message and file URL when upload is successful', async () => {
      const mockFile: Express.Multer.File = {
        filename: 'example-image.jpg',
      } as any;

      const uploadResponse = {
        message: 'File uploaded successfully',
        fileUrl: '/uploads/example-image.jpg',
      };

      mockImageUploadService.uploadImage.mockReturnValue(uploadResponse);

      const result = await controller.uploadImage(mockFile);

      expect(result).toEqual(uploadResponse);
      expect(service.uploadImage).toHaveBeenCalledWith(mockFile);
    });

    it('should throw an error if no file is provided', async () => {
      const mockFile: Express.Multer.File = null;

      try {
        await controller.uploadImage(mockFile);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No file uploaded');
      }
    });

  });

  describe('getImages', () => {
    it('should return a list of images', async () => {
      const imageList = [
        { name: 'image1.jpg', url: '/uploads/image1.jpg' },
        { name: 'image2.jpg', url: '/uploads/image2.jpg' },
      ];

      mockImageUploadService.getImages.mockReturnValue(imageList);

      const result = await controller.getImages();

      expect(result).toEqual(imageList);
      expect(service.getImages).toHaveBeenCalled();
    });

    it('should return an empty list if no images are available', async () => {
      mockImageUploadService.getImages.mockReturnValue([]);

      const result = await controller.getImages();

      expect(result).toEqual([]);
      expect(service.getImages).toHaveBeenCalled();
    });
  });
});
