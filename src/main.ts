import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EitherInterceptor } from './core/helpers/either.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new EitherInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
