import { ApiProperty } from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class QuizDto {
  id: string;
  question: string;
  answerList: string[];
}
export class ResponseQuizListDto extends CoreResponseDto {
  constructor() {
    super();
    this.data = [];
  }
  data: QuizDto[];
}
