import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";

export type AnswerDocument = Answer & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class Answer {
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
    example: "0x2C20335750bD536e81f19E588Bb94e6eC93e34CC",
    description: "user's wallet address",
    required: true,
    type: String,
  })
  @Prop({ type: String, collation: { locale: "en", strength: 2 } })
  wallet: string;

  @ApiProperty({
    example: "62e8eef54b0598a62819330f",
    description: "MongoDB Object ID",
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId })
  quiz;

  @ApiProperty({
    example: "yes",
    description: "user's answer to quiz",
    required: true,
    type: String,
  })
  answer;

  @ApiProperty({
    example: "yes",
    description: "user's answer to quiz",
    required: true,
    type: Number,
  })
  ratio;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

AnswerSchema.plugin(mongoosePaginate);
AnswerSchema.plugin(mongooseAggregatePaginate);
export const pagedAnswerSchema = AnswerSchema;
