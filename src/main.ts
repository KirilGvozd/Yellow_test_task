import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle("Running app API")
      .setDescription("Running app API description")
      .setVersion("1.0")
      .addTag("Running record")
      .addCookieAuth()
      .build();
  // @ts-ignore
  const document = SwaggerModule.createDocument(app, config);
  // @ts-ignore
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();