import {Controller, Post, Body, UseInterceptors, UploadedFile, Get} from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiOperation} from "@nestjs/swagger";
import { Express } from 'express';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageUploadService.uploadImage(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of images' })
  async getImages() {
    return this.imageUploadService.getImages();
  }
}
