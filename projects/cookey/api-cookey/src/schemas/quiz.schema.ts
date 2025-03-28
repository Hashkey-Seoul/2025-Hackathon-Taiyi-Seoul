import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class Quiz {
  constructor() {
    this._id = new Types.ObjectId();
  }

  @ApiProperty({
    example: "62e8eef54b0598a62819330f",
    description: "MongoDB Object ID",
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id;

  @ApiProperty({
    example: "Do you handsome???",
    description: "question string",
    required: true,
    type: String,
  })
  @Prop({ type: String })
  question: string;

  @ApiProperty({
    example: "['yes','no']",
    description: "string type answer list",
    required: true,
    type: String,
  })
  @Prop({ type: [String] })
  answerList: string[];

  @ApiProperty({
    example: "yes",
    description: "correct",
    required: true,
    type: String,
  })
  @Prop({ type: String })
  correctAnswer: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.plugin(mongoosePaginate);
QuizSchema.plugin(mongooseAggregatePaginate);
export const pagedQuizSchema = QuizSchema;
