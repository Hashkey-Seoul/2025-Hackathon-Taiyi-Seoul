import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { ApiTags } from "@nestjs/swagger";
import { QuizSubmissionDto } from "./dto/request-quiz.dto";

@ApiTags("Quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // @Post("/")
  // postQuiz(@Query() quries) {
  //   return this.quizService.postQuiz();
  // }
  // @Post("/deck")
  // postQuizDeck(@Query() quries) {
  //   return this.quizService.postQuizDeck();
  // }
  @Post("/submission")
  postQuizDeck(@Body() body: QuizSubmissionDto) {
    return this.quizService.postSubmission(body);
  }
  @Get("/deck")
  getQuizDeck(@Query() quries) {
    return this.quizService.getQuizDeck();
  }
  @Get("/")
  getQuiz(@Query() quries) {
    return this.quizService.getQuiz();
  }
}
