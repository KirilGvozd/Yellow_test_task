import { Module } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import { ImageUploadController } from './image_upload.controller';
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
