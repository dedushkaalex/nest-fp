import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EitherInterceptor } from './core/helpers/either.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

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

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new EitherInterceptor());

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
