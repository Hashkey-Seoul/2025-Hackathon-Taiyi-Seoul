import { ApiProperty } from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class QuizDto {
  id: string;
  question: string;
  answerList: string[];
  correctAnswer: string;
  isDone: boolean;
  credits: number;
  points: number;
}

export class QuizDeckDto {
  constructor() {
    this.quizList = [];
  }
  id: string;
  title: string;
  isUnlock: boolean;
  cost: number;
  quizList: QuizDto[];
  credits: number;
  points: number;
}

export class ResponseQuizListDto extends CoreResponseDto {
  constructor() {
    super();
    this.data = [];
  }
  data: QuizDto[];
  credits: number;
  points: number;
}

export class ResponseQuizDeckListDto extends CoreResponseDto {
  constructor() {
    super();
    this.data = [];
  }
  data: QuizDeckDto[];
  credits: number;
  points: number;
}
