import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { ApiProperty } from "@nestjs/swagger";

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })
export class User {
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
  @Prop({ type: String })
  nickname;

  @ApiProperty({
    description: "web3 wallet address",
    type: String,
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
    collation: { locale: "en", strength: 2 },
  })
  wallet;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseAggregatePaginate);
export const pagedUserSchema = UserSchema;
