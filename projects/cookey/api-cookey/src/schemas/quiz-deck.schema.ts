import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";
import { Quiz } from "./quiz.schema";

export type QuizDeckDocument = QuizDeck & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class QuizDeck {
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
    example: "Daily quiz deck 3/28",
    description: "quiz deck title",
    required: true,
    type: String,
  })
  @Prop({ type: String })
  title: string;

  @ApiProperty({
    example: "['62e8eef54b0598a62819330f','62e8eef54b0598a62819440f']",
    description: "quiz db list",
    required: true,
    type: [Quiz],
  })
  @Prop({ type: () => [Quiz], ref: "Quiz" })
  quizList: Quiz[];
}

export const QuizDeckSchema = SchemaFactory.createForClass(QuizDeck);

QuizDeckSchema.plugin(mongoosePaginate);
QuizDeckSchema.plugin(mongooseAggregatePaginate);
export const pagedQuizSchema = QuizDeckSchema;
