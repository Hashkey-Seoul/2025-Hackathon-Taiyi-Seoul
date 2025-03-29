import { Injectable } from "@nestjs/common";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import {
  QuizDeckDto,
  QuizDto,
  ResponseQuizDeckListDto,
  ResponseQuizListDto,
} from "./dto/response-quiz.dto";
import { Quiz } from "src/schemas/quiz.schema";
import { QuizDeck } from "src/schemas/quiz-deck.schema";
import { Types } from "mongoose";
import { QuizSubmissionDto } from "./dto/request-quiz.dto";
import { Answer } from "src/schemas/answer.schema";

@Injectable()
export class QuizService {
  constructor(private readonly modelManager: ModelmanagerService) {}

  async postQuiz() {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const quiz = new Quiz();
    try {
      quiz.question =
        "What is a major reason why developers should build on HashKey Chain?";
      quiz.answerList = [
        "Zero gas fees forever",
        "Ecosystem support for social apps",
        "Mandatory KYC for users",
        "No smart contract support",
      ];
      quiz.correctAnswer = "Ecosystem support for social apps ";

      await quizModel.create(quiz);
    } catch (error) {}
    return "done";
  }
  async postQuizDeck() {
    const quizDeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const deck = new QuizDeck();
    try {
      deck.title = "Hashkey Quiz";
      deck.quizList = await quizModel.find();
      console.log(deck);
      await quizDeckModel.create(deck);
    } catch (error) {
      console.log(error);
    }
  }
  async postSubmission(body: QuizSubmissionDto) {
    const answerModel = this.modelManager.getModel(ModelType.ANSWER);

    const answer = new Answer();
    try {
      answer.deckTitle = body.deckTitle;
      answer.quiz = new Types.ObjectId(body.quizId);
      answer.quizTitle = body.quizTitle;
      answer.quizdeck = new Types.ObjectId(body.deckId);
      answer.selectedAnswer = body.selectedAnswer;
      answer.timeout = body.timeout;
      answer.selectedPercentage = body.selectedPercentage;
      answer.wallet = body.walletAddress;

      await answerModel.create(answer);
    } catch (error) {
      console.log(error);
    }
  }
  async getQuizDeck() {
    const quizdeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const response = new ResponseQuizDeckListDto();
    try {
      const deckAll = await quizdeckModel.find();
      for (const deck of deckAll) {
        const quizdeckDto = new QuizDeckDto();
        quizdeckDto.id = deck._id;
        quizdeckDto.title = deck.title;
        for (const quiz of deck.quizList) {
          const quizDto = new QuizDto();
          quizDto.id = quiz._id;
          quizDto.question = quiz.question;
          quizDto.answerList = quiz.answerList;
          quizDto.correctAnswer = quiz.correctAnswer;
          quizdeckDto.quizList.push(quizDto);
        }
        response.data.push(quizdeckDto);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }
  async getQuiz() {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const response = new ResponseQuizListDto();
    try {
      const quizAll = await quizModel.find();
      for (const quiz of quizAll) {
        const quizDto = new QuizDto();
        quizDto.id = quiz._id;
        quizDto.question = quiz.question;
        quizDto.answerList = quiz.answerList;
        quizDto.correctAnswer = quiz.correctAnswer;
        response.data.push(quizDto);
      }
    } catch (error) {}
    return response;
  }
}
