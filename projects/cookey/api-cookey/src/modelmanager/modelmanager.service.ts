import { Injectable, Inject, LoggerService, Logger } from "@nestjs/common";
import {
  Model,
  PaginateModel,
  Types,
  Schema as MongooseSchema,
  Connection,
} from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { AggregatePaginateModel } from "mongoose";
import { ModelType } from "src/enums/type.enum";
import { User, UserDocument } from "src/schemas/user.schema";
import { Quiz, QuizDocument } from "src/schemas/quiz.schema";
import { Answer, AnswerDocument } from "src/schemas/answer.schema";
import { QuizDeck, QuizDeckDocument } from "src/schemas/quiz-deck.schema";
import {
  Transaction,
  TransactionDocument,
} from "src/schemas/transaction.schema";

@Injectable()
export class ModelmanagerService {
  constructor(
    @InjectModel(User.name)
    private userModel: AggregatePaginateModel<UserDocument>,
    @InjectModel(Quiz.name)
    private quizModel: AggregatePaginateModel<QuizDocument>,
    @InjectModel(QuizDeck.name)
    private quizDeckModel: AggregatePaginateModel<QuizDeckDocument>,
    @InjectModel(Answer.name)
    private answerModel: AggregatePaginateModel<AnswerDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: AggregatePaginateModel<TransactionDocument>,
  ) {}

  getAggregateModel(type): AggregatePaginateModel<any> {
    switch (type) {
      case ModelType.USER:
        return this.userModel;
      case ModelType.QUIZ:
        return this.quizModel;
      case ModelType.QUIZDECK:
        return this.quizDeckModel;
      case ModelType.ANSWER:
        return this.answerModel;
      case ModelType.TRANSACTION:
        return this.transactionModel;
      default:
        return null;
    }
  }

  getModel(type): Model<any> {
    switch (type) {
      case ModelType.USER:
        return this.userModel;
      case ModelType.QUIZ:
        return this.quizModel;
      case ModelType.QUIZDECK:
        return this.quizDeckModel;
      case ModelType.ANSWER:
        return this.answerModel;
      case ModelType.TRANSACTION:
        return this.transactionModel;
      default:
        return null;
    }
  }
}
