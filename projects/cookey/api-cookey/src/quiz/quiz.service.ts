import { Injectable } from "@nestjs/common";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import { QuizDto, ResponseQuizListDto } from "./dto/response-quiz.dto";
import { Quiz } from "src/schemas/quiz.schema";

@Injectable()
export class QuizService {
  constructor(private readonly modelManager: ModelmanagerService) {}

  async postQuiz() {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const quiz = new Quiz();
    try {
      quiz.question = "Which consensus mechanism does HashKey Chain use?";
      quiz.answerList = [
        "Proof of Work",
        "Delegated Proof of Stake",
        "Proof of Authority",
        "Nominated Proof of Stake",
      ];
      quiz.correctAnswer = "Proof of Authority";

      await quizModel.create(quiz);
    } catch (error) {}
    return "done";
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
