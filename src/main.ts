import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const config = app.get(ConfigService);
  setUpSwagger(app, config);

  function setUpSwagger(app: INestApplication, config: ConfigService) {
    Logger.log(
      'Swagger config enabled: \x1b[35m true' ,
      'BootstrapFunction'
    );
  
   // if (config.get('swagger.enabled') === 'true') {
      const options = new DocumentBuilder()
        .setTitle('API Pokemon')
        .setDescription('test pokemom.')
        .setVersion('0.0.1')
        .build();
  
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('doc', app, document);
   // }
  }
}
bootstrap();
