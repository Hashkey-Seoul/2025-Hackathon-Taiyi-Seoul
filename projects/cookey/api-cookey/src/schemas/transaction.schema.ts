import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class Transaction {
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
    description: "nickname",
    type: String,
  })
  @Prop({ type: String, unique: true })
  hash;

  @ApiProperty({
    description: "web3 wallet address",
    type: String,
  })
  @Prop({
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  })
  from;

  @ApiProperty({
    description: "HSK value",
    type: Number,
  })
  @Prop({ type: Number })
  value;

  @ApiProperty({
    description: "blockNumber",
    type: Number,
  })
  @Prop({ type: Number })
  blockNumber;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.plugin(mongooseAggregatePaginate);
export const pagedTransactionSchema = TransactionSchema;
