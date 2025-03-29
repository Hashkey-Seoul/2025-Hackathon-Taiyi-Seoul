import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";
import { Quiz } from "./quiz.schema";
import { QuizDeck } from "./quiz-deck.schema";

export type UnlockDeckDocument = UnlockDeck & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class UnlockDeck {
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
    example: "62e8eef54b0598a62819330f",
    description: "deck id",
    required: true,
    type: QuizDeck,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "QuizDeck" })
  deck;

  @ApiProperty({
    description: "web3 wallet address",
    type: String,
  })
  @Prop({
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  })
  wallet;
}

export const UnlockDeckSchema = SchemaFactory.createForClass(UnlockDeck);

UnlockDeckSchema.plugin(mongoosePaginate);
UnlockDeckSchema.plugin(mongooseAggregatePaginate);
export const pagedUnlockDeckSchema = UnlockDeckSchema;
