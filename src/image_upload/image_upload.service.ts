import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {Express} from "express";

@Injectable()
export class ImageUploadService {
  private readonly uploadsPath = path.join(__dirname, '..', '..', 'uploads');

  uploadImage(file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      fileUrl: `/uploads/${file.filename}`,
    };
  }

  getImages() {
    const files = fs.readdirSync(this.uploadsPath);
    return files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));
  }
}
