import { Module } from "@nestjs/common";
import { ModelmanagerService } from "./modelmanager.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { Answer, AnswerSchema } from "src/schemas/answer.schema";
import { Quiz, QuizSchema } from "src/schemas/quiz.schema";
import { QuizDeck, QuizDeckSchema } from "src/schemas/quiz-deck.schema";
import { Transaction, TransactionSchema } from "src/schemas/transaction.schema";
import { UnlockDeck, UnlockDeckSchema } from "src/schemas/unlock-deck.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizDeck.name, schema: QuizDeckSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: UnlockDeck.name, schema: UnlockDeckSchema },
    ]),
  ],
  exports: [ModelmanagerService],
  providers: [ModelmanagerService],
})
export class ModelmanagerModule {}
