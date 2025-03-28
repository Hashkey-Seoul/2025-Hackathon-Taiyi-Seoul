import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { ModelmanagerModule } from "src/modelmanager/modelmanager.module";

@Module({
  imports: [ModelmanagerModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
