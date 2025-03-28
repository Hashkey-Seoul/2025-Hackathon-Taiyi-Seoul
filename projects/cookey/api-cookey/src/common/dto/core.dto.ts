import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { CodeStatus } from "src/enums/status-code.enum";
import { StatusMessage } from "src/enums/status-message.enum";

export class PageMetaInfo {
  @ApiProperty({ description: "전체 결과 수", type: Number, example: "40" })
  @IsNumber()
  totalDocs;

  @ApiProperty({ description: "페이지당 개수", type: Number, example: "3" })
  @IsNumber()
  limit;

  @ApiProperty({ description: "전체 페이지", type: Number, example: "14" })
  @IsNumber()
  totalPages;

  @ApiProperty({ description: "현재 페이지", type: Number, example: "1" })
  @IsNumber()
  page;

  @ApiProperty({
    description:
      "현재 페이지의 첫 번째 문서의 시작 색인 번호입니다. (예: 페이지=2 및 제한=10인 경우, 페이지 카운터는 11)",
    type: Number,
    example: "11",
  })
  @IsNumber()
  pagingCounter;

  @ApiProperty({
    description: "이전 페이지 존재 유무",
    type: Boolean,
    example: "false",
  })
  @IsBoolean()
  hasPrevPage;

  @ApiProperty({
    description: "다음 페이지 존재 유무",
    type: Boolean,
    example: "true",
  })
  @IsBoolean()
  hasNextPage;

  @ApiProperty({
    description: "이전 페이지 인덱스(없으면 null)",
    type: Number,
    example: "null",
  })
  @IsNumber()
  prevPage;

  @ApiProperty({
    description: "다음 페이지 인덱스(없으면 null)",
    type: Number,
    example: "2",
  })
  @IsNumber()
  nextPage;
}

export class CoreResponseDto {
  constructor() {
    this.code = CodeStatus.GLOBAL_SUCCESS;
    this.message = StatusMessage.GLOBAL_SUCCESS;
  }
  @ApiProperty({ description: "리턴 코드", type: Number })
  @IsNumber()
  code;

  @ApiProperty({ description: "리턴 메시지", type: String })
  @IsString()
  message;

  @ApiProperty({ description: "페이지 관련 meta data", type: PageMetaInfo })
  @IsString()
  pageMetaInfo;

  @ApiProperty({ description: "error stack", type: String })
  @IsString()
  errorStack;
}

export class CoreResponseSingleDto {
  constructor() {
    this.code = CodeStatus.GLOBAL_SUCCESS;
    this.message = StatusMessage.GLOBAL_SUCCESS;
  }
  @ApiProperty({ description: "리턴 코드", type: Number })
  @IsNumber()
  code;

  @ApiProperty({ description: "리턴 메시지", type: String })
  @IsString()
  message;

  @ApiProperty({ description: "error stack", type: String })
  @IsString()
  errorStack;
}
