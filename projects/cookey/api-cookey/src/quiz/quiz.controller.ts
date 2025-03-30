import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { ApiTags } from "@nestjs/swagger";
import { QuizSubmissionDto, UnlockDeckDto } from "./dto/request-quiz.dto";

@ApiTags("Quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // @Post("/")
  // postQuiz(@Query() quries) {
  //   return this.quizService.postQuiz();
  // }
  // @Post("/deck")
  // postQuizDecke(@Query() quries) {
  //   return this.quizService.postQuizDeck();
  // }
  @Post("/submission")
  postSubmission(@Body() body: QuizSubmissionDto) {
    return this.quizService.postSubmission(body);
  }
  @Get("/deck")
  getQuizDeck(@Query() quries) {
    return this.quizService.getQuizDeck();
  }
  @Get("/deck/:wallet")
  getQuizDeckWallet(@Param("wallet") wallet) {
    return this.quizService.getQuizDeckWallet(wallet);
  }
  @Post("/deck/unlock/")
  unlockQuizDeckWallet(@Body() body: UnlockDeckDto) {
    return this.quizService.unlockQuizDeckWallet(body);
  }
  @Get("/")
  getQuiz(@Query() quries) {
    return this.quizService.getQuiz();
  }
  @Get("/:wallet")
  getQuizWallet(@Param("wallet") wallet) {
    return this.quizService.getQuizWallet(wallet);
  }
}
