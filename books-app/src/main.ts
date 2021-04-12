import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200', // angular
      'http://localhost:3000', // react
      'http://localhost:8081', // react-native
    ],
  });
  const config = new DocumentBuilder()
    .setTitle('Qeraty')
    .setDescription('Qeraty API description')
    .setVersion('1.0')
    .addTag('Books-App')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  try{

    SwaggerModule.setup('swagger-ui', app, document);
  }catch(e){
    console.log("here",e)
  }
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');

}
bootstrap();