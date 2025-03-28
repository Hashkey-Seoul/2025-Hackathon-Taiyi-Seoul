import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsMimeType,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Schema as MongooseSchema } from "mongoose";
import { Transform, Type } from "class-transformer";

export class FileDto {
  @ApiProperty({
    example: "inlee_theIsland1.mov",
    description: "파일명",
    type: String,
  })
  @IsString()
  filename: string;

  @ApiProperty({
    example: "image/jpeg",
    description: "resource url에 업로드된 리소스 타입",
    type: "MimeType(Content-type) format string",
  })
  @IsString()
  @Transform((params) => {
    const type = params.value.split("/")[0];
    if (type !== "image" && type !== "video") {
      throw new BadRequestException(`resource type invalid ${type}`);
    }

    return params.value.split("/")[0];
  })
  contentType: string;
}
