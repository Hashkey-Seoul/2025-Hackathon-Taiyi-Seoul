import { Injectable, Inject, LoggerService, Logger } from "@nestjs/common";
import {
  Model,
  PaginateModel,
  Types,
  Schema as MongooseSchema,
  Connection,
} from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { AggregatePaginateModel } from "mongoose";
import { ModelType } from "src/enums/type.enum";
import { User, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class ModelmanagerService {
  constructor(
    @InjectModel(User.name)
    private userModel: AggregatePaginateModel<UserDocument>,
  ) {}

  getAggregateModel(type): AggregatePaginateModel<any> {
    switch (type) {
      case ModelType.USER:
        return this.userModel;
      default:
        return null;
    }
  }

  getModel(type): Model<any> {
    switch (type) {
      case ModelType.USER:
        return this.userModel;
      default:
        return null;
    }
  }
}
