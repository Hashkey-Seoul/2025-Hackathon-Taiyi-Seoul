import { Module } from "@nestjs/common";
import { ModelmanagerService } from "./modelmanager.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { Answer, AnswerSchema } from "src/schemas/answer.schema";
import { Quiz, QuizSchema } from "src/schemas/quiz.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  exports: [ModelmanagerService],
  providers: [ModelmanagerService],
})
export class ModelmanagerModule {}
