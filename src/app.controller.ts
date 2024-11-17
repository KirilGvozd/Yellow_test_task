import {Controller, Get, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiResponse} from "@nestjs/swagger";

@Controller()
export class AppController {
}
