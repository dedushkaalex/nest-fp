import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EitherInterceptor } from './core/helpers/either.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // Re-added
import { ApplyTokensInterceptor } from './core/modules/iam/apply-token.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const config = new DocumentBuilder()
    .setTitle('Nest FP API')
    .setDescription('The Nest FP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(
    new EitherInterceptor(),
    new ApplyTokensInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser(process.env.COOKIE_SECRET ?? 'secret', {}));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
