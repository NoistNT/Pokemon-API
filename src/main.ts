import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
dotenv.config();

const { PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (PORT) {
    await app.listen(PORT);
  } else {
    console.error('PORT is not defined');
  }
}
bootstrap();
