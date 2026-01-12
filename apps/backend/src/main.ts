import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { EitherInterceptor } from './core/helpers/either.interceptors';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'X-Requested-With',
      'Authorization',
    ],
    credentials: true,
  });

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Nest FP API')
    .setDescription('The Nest FP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true,
      skipUndefinedProperties: true,
    }),
  );
  app.useGlobalInterceptors(
    new EitherInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  app.use(cookieParser(cookieSecret ?? 'secret', {}));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const port = configService.get('APP_PORT');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const host = configService.get('APP_HOST');

  await app.listen(port, host);

  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${GLOBAL_PREFIX}`,
  );
}

void bootstrap();
