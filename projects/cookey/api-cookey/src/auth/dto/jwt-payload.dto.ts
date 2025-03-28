import { IsEthereumAddress, IsMongoId, IsNotEmpty } from "class-validator";
import { Schema as MongooseSchema } from "mongoose";

// export class JwtPayloadDto {
//   @IsNotEmpty()
//   @IsMongoId()
//   userOid: MongooseSchema.Types.ObjectId;

//   @IsNotEmpty()
//   @IsEthereumAddress()
//   userWallet: string;
// }

export class JwtPayloadDto {
  oid: MongooseSchema.Types.ObjectId;
}
