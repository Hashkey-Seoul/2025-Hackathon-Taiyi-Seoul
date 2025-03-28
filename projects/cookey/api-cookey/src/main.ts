import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { winstonLogger } from "./utils/winston.util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  if (process.env.MODE !== "LIVE") {
    const config = new DocumentBuilder()
      .setTitle("Cookey API")
      .setDescription("")
      .setVersion("1.0")
      .addTag("Cookey")
      .addBearerAuth()
      .addApiKey()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
  // app.enableCors();

  await app.listen(3001);
}

bootstrap();
