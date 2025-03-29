import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";
import { CoreResponseDto } from "src/common/dto/core.dto";
import { boolean } from "zod";

export class RequestUploadDto {
  @ApiProperty({
    description: "이미지 url",
    type: String,
  })
  @IsUrl()
  url: string;
}

export class QuizSubmissionDto {
  @IsString()
  @IsOptional()
  deckId: string;

  @IsString()
  @IsOptional()
  deckTitle: string;

  @IsString()
  @IsOptional()
  quizId: string;

  @IsString()
  @IsOptional()
  quizTitle: string;

  @IsString()
  @IsOptional()
  selectedAnswer: string;

  @IsBoolean()
  @IsOptional()
  timeout: boolean;

  @IsNumber()
  @IsOptional()
  selectedPercentage: number;

  @IsString()
  @IsOptional()
  walletAddress: string;
}
