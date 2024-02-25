import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
