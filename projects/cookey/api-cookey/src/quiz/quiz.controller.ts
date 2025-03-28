import { Controller, Get, Post, Query } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post("/")
  postQuiz(@Query() quries) {
    return this.quizService.postQuiz();
  }
  @Get("/")
  getQuiz(@Query() quries) {
    return this.quizService.getQuiz();
  }
}
