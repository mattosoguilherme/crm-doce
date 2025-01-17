import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const documentOptions = new DocumentBuilder()
    .setTitle('crm')
    .setDescription('organiazacao de clientes')
    .setVersion('1.0')
    .addTag('CRM')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3080;



  await app.listen( process.env.PORT || 3080, () => { 
    console.log(`Server is running on http://localhost:${port}/api`);
  }) ;  
}
bootstrap();
