import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
  Inject,
  Logger,
  LoggerService,
} from "@nestjs/common";
import AWS, { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { basename, dirname, parse } from "path";
import {
  ResponsePreSignedPostUrlDto,
  ResponseUrlDto,
  ResponseUrlMultiDto,
} from "./dto/response-url.dto";

import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { CoreResponseDto } from "src/common/dto/core.dto";
import { CodeStatus } from "src/enums/status-code.enum";
import { StatusMessage } from "src/enums/status-message.enum";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
// import { ipRangeCheck } from 'ip-range-check';

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import { ModelType } from "src/enums/type.enum";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";

@Injectable()
export class AwsS3Service {
  s3: S3;
  s3Client: S3Client;
  regionRange;
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly modelService: ModelmanagerService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: process.env.AWS_SIGNITURE_VERSION,
    });
    // this.s3Client = new S3Client({
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   },
    // });
    // this.regionRange = JSON.parse(readFileSync('aws-ip-range.json', 'utf-8'));
  }

  getS3Client() {
    return this.s3;
  }

  async presignedPost(mode, requestUrldto) {
    try {
      if (mode != "create" && mode != "modify")
        return {
          code: CodeStatus.AWS_INVALID_UPLOAD_MODE,
          message: `${StatusMessage.AWS_INVALID_UPLOAD_MODE} [${mode}]`,
        };

      const resourceType = requestUrldto.contentType.split("/")[0]; // image || video
      const startCondition = [
        "starts-with",
        "$Content-Type",
        `${resourceType}/`,
      ];
      const sizeCondition = [
        "content-length-range",
        0,
        +process.env.AWS_S3_MAX_UPLOAD_SIZE * 1000 * 1000,
      ];

      if (resourceType != "image" && resourceType != "video")
        return {
          code: CodeStatus.AWS_INVALID_RESOURCE_TYPE,
          message: `${StatusMessage.AWS_INVALID_RESOURCE_TYPE} [${resourceType}]`,
        };

      if (mode == "modify" && requestUrldto.targetId == null)
        return {
          code: CodeStatus.AWS_NO_TARGET_ID,
          message: `Mode is [${mode}] but ${StatusMessage.AWS_NO_TARGET_ID}`,
        };

      const s3DestKey = await this._bucketPathGenerator(
        resourceType,
        requestUrldto.category,
        requestUrldto.filename,
        mode,
        requestUrldto.targetId,
      );

      return new Promise((resovle, reject) => {
        this.s3.createPresignedPost(
          {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Fields: {
              s3DestKey,
            },
            Expires: 5,
            Conditions: [sizeCondition, startCondition],
          },
          (err, data) => {
            // 두번째 인자로 콜백함수 성공,실패제어
            if (err) reject(err);
            else {
              const responsePreSignedPostUrlDto =
                new ResponsePreSignedPostUrlDto();
              responsePreSignedPostUrlDto.code = CodeStatus.GLOBAL_SUCCESS;
              responsePreSignedPostUrlDto.message =
                StatusMessage.GLOBAL_SUCCESS;
              responsePreSignedPostUrlDto.presignedUrlBody = data;
              resovle(responsePreSignedPostUrlDto);
            }
            return;
          },
        );
      });

      // const signedUrl = this.s3.getSignedUrl('putObject', {
      //   Bucket: process.env.AWS_S3_BUCKET_NAME,
      //   Key: s3DestKey,
      //   Expires: 5,
      // });
      // const responseUrlDto = new ResponseUrlDto();
      // responseUrlDto.code = CodeStatus.GLOBAL_SUCCESS;
      // responseUrlDto.message = StatusMessage.GLOBAL_SUCCESS;
      // responseUrlDto.signedUrl = signedUrl;
      // return responseUrlDto;
    } catch (error) {
      this.logger.error(`[presignedPost] : ${error.message}`, error.stack);
      const coreResponseDto = new CoreResponseDto();
      coreResponseDto.code = CodeStatus.GLOBAL_SYSTEM_ERROR;
      coreResponseDto.message = error.message;
      return coreResponseDto;
    }
  }

  async getSignedURLByQuries(jwtUser: JwtPayloadDto, quries) {
    const response = new ResponseUrlDto();
    try {
      const category = jwtUser.oid; //quries.category;
      const contentType = quries.contenttype;
      const filename = quries.file;

      //:category/:mongoid/main.{ext}
      const path = `${category}/${uuid()}${parse(filename).ext}`;

      const signedUrl = this.s3.getSignedUrl("putObject", {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path,
        Expires: +process.env.AWS_S3_SIGNEDURL_TTL,
        ContentType: contentType,
        ACL: "public-read",
      });
      const url = new URL(signedUrl);

      response.code = CodeStatus.GLOBAL_SUCCESS;
      response.message = StatusMessage.GLOBAL_SUCCESS;
      response.signedUrl = signedUrl;
      response.accessUrl = `${url.origin}${url.pathname}`;
    } catch (error) {
      this.logger.error(`[getSignedURL] : ${error.message}`, error.stack);
      response.code = CodeStatus.GLOBAL_SYSTEM_ERROR;
      response.message = error.message;
    }
    return response;
  }

  async _bucketPathGenerator(resourceType, category, filename, mode, targetId) {
    let generatedPath;
    let s3filename;
    const fileExt = parse(filename).ext;

    switch (mode) {
      case "create":
        s3filename = `${uuid()}${fileExt}`;
        break;
      case "modify":
        s3filename = await this._getExistFilePath(
          targetId,
          category,
          resourceType,
        );
        break;
      default:
        throw new Error(`Unknown Mode [${mode}]`);
    }

    switch (resourceType) {
      case "image":
        generatedPath = `images/original/${category}/${s3filename}`;
        break;
      case "video":
        generatedPath = `videos/original/${category}/${s3filename}`;
        break;
      default:
        throw new Error(`Unknown Type [${resourceType}]`);
    }

    return generatedPath;
  }

  _s3Path(resourceType, category, filePath) {
    switch (resourceType) {
      case "image":
        return `images/original/${category}/${filePath}`;

      case "video":
        return `videos/original/${category}/${filePath}`;

      default:
        throw new Error(`Unknown Type [${resourceType}]`);
    }
  }

  async _getExistFilePath(targetId, category, resourceType) {
    let ret;
    let parsedData;
    let path;

    //TODO: 기존 파일 경로를 리턴해서 덮어씌우는 경우,
    //기존 UUID를 이용하여 파일명은 같도록 관리할 수 있음
    //파일 확장자가 바뀔경우(.MP4 => MOV) 의 경우는 현재 관리되고 있지 않음
    //어떻게 할 것 인가???

    // switch (category) {
    //   case S3BucketType.UserProfile:
    //     ret = await this.userModel.findById(targetId);
    //     if (ret == null) throw new Error(`No User Found [${targetId}]`);
    //     if (
    //       ret.profileResource?.origin == null &&
    //       ret.profileResource?.video?.origin == null
    //     )
    //       throw new Error(`Parse Failed UserData ProfileImage: [${targetId}]`);
    //     if (resourceType == "image")
    //       parsedData = parse(ret.profileResource?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.profileResource?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.UserCover:
    //     ret = await this.userModel.findById(targetId);
    //     if (ret == null) throw new Error(`No User Found [${targetId}]`);
    //     if (
    //       ret.coverResource?.origin == null &&
    //       ret.coverResource?.video?.origin == null
    //     )
    //       throw new Error(`Parse Failed UserData ProfileImage: [${targetId}]`);
    //     if (resourceType == "image")
    //       parsedData = parse(ret.coverResource?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.coverResource?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.Exhibition:
    //     ret = await this.exhibitionModel.findById(targetId);
    //     if (ret.main?.origin == null && ret.main?.video?.origin == null)
    //       throw new Error(
    //         `Parse Failed ExhibitionData Main Image : [${targetId}]`,
    //       );
    //     if (resourceType == "image") parsedData = parse(ret.main?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.main?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.ExhibitionBackground:
    //     ret = await this.exhibitionModel.findById(targetId);
    //     if (ret == null) throw new Error(`No Exhibition Found [${targetId}]`);
    //     if (
    //       ret.background?.origin == null &&
    //       ret.background?.video?.origin == null
    //     )
    //       throw new Error(
    //         `Parse Failed ExhibitionData Background Image : [${targetId}]`,
    //       );
    //     if (resourceType == "image") parsedData = parse(ret.background?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.background?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.Artwork:
    //     ret = await this.artWorkModel.findById(targetId);
    //     if (ret == null) throw new Error(`No Artwork Found [${targetId}]`);
    //     if (ret.resource?.origin == null && ret.resource?.video?.origin == null)
    //       throw new Error(`Parse Failed ArtworkData resource : [${targetId}]`);
    //     if (resourceType == "image") parsedData = parse(ret.resource?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.resource?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.ArtCollection:
    //     ret = await this.artCollectionModel.findById(targetId);
    //     if (ret == null)
    //       throw new Error(`No Artcollection Found [${targetId}]`);
    //     if (
    //       ret.mainResource?.origin == null &&
    //       ret.mainResource?.video?.origin == null
    //     )
    //       throw new Error(
    //         `Parse Failed ArtCollection Main Image : [${targetId}]`,
    //       );
    //     if (resourceType == "image")
    //       parsedData = parse(ret.mainResource?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.mainResource?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.Notice:
    //     ret = await this.mainBannerModel.findById(targetId);
    //     if (ret == null) throw new Error(`No Notice Found [${targetId}]`);
    //     if (ret.resource?.origin == null && ret.resource?.video?.origin == null)
    //       throw new Error(
    //         `Parse Failed Mainbanner Notice Image : [${targetId}]`,
    //       );
    //     if (resourceType == "image") parsedData = parse(ret.resource?.origin);
    //     if (resourceType == "video")
    //       parsedData = parse(ret.resource?.video?.origin);

    //     path = parsedData.base;
    //     break;
    //   case S3BucketType.Drops:
    //     throw new Error("Not Implement Yet");

    //   default:
    //     throw new Error(`Unknown Category [${category}]`);
    // }
    return path;
  }

  // async awsLambdaUpdateMipmapPath(
  //   key,
  //   schemaType,
  //   dirname,
  //   filename,
  //   size,
  //   ext,
  // ) {
  //   const error = new Error();
  //   const dropsModel = this.modelService.getModel(ModelType.Drops);
  //   const artworkModel = this.modelService.getModel(ModelType.ArtWork);
  //   try {
  //     if (key !== process.env.ARTTOKEN_DATAAPI_AUTHKEY) {
  //       error.message = `Invalid AuthKey Exception ${key}`;
  //       throw error;
  //     }

  //     let targetPath;
  //     let smipmapTargetPath;
  //     let data;
  //     let query;
  //     let smipmapKey;
  //     let filter;
  //     switch (schemaType) {
  //       case 'Artwork':
  //         {
  //           // filter = {
  //           //   'resource.filename': filename,
  //           // };
  //           targetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${filename}/${size}${ext}`;
  //           smipmapTargetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/smipmap/${filename}/${size}.jpeg`;

  //           // query = `resource.mipmap.x${size}`;
  //           // smipmapKey = `resource.smipmap.x${size}`;

  //           // data = await this.artworkService.getArtworkModel().findOneAndUpdate(
  //           //   filter,
  //           //   {
  //           //     $set: { [query]: targetPath, [smipmapKey]: smipmapTargetPath },
  //           //   },
  //           //   {
  //           //     upsert: false,
  //           //   },
  //           // );

  //           //2023.09.20 드롭스 대응을 위한 로직 업데이트
  //           const artwork = await artworkModel.findOne({
  //             'resource.filename': filename,
  //           });
  //           const drops = await dropsModel.findOne({
  //             'artworks.resource.filename': filename,
  //           });
  //           if (artwork) {
  //             artwork.resource.mipmap[`x${size}`] = targetPath;
  //             artwork.resource.smipmap[`x${size}`] = smipmapTargetPath;
  //             data = await artworkModel.findByIdAndUpdate(
  //               artwork._id,
  //               artwork,
  //               { upsert: false },
  //             );
  //           } else if (drops) {
  //             const artwork = drops.artworks.find(
  //               (artwork) => artwork.resource.filename === filename,
  //             );
  //             artwork.resource.mipmap[`x${size}`] = targetPath;
  //             artwork.resource.smipmap[`x${size}`] = smipmapTargetPath;
  //             data = await dropsModel.findByIdAndUpdate(drops._id, drops, {
  //               upsert: false,
  //             });
  //           } else {
  //             error.message = `No Artwork or No Drops!!  resource id : ${filename}`;
  //             throw error;
  //           }
  //         }
  //         break;
  //       case 'UserProfile':
  //         filter = {
  //           'profileResource.filename': filename,
  //         };
  //         targetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${filename}/${size}${ext}`;

  //         query = `profileResource.mipmap.x${size}`;

  //         data = await this.userService.getUserModel().findOneAndUpdate(
  //           filter,
  //           {
  //             $set: { [query]: targetPath },
  //           },
  //           {
  //             upsert: false,
  //           },
  //         );
  //         break;
  //       case 'UserCover':
  //         filter = {
  //           'coverResource.filename': filename,
  //         };
  //         targetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${filename}/${size}${ext}`;

  //         query = `coverResource.mipmap.x${size}`;

  //         data = await this.userService.getUserModel().findOneAndUpdate(
  //           filter,
  //           {
  //             $set: { [query]: targetPath },
  //           },
  //           {
  //             upsert: false,
  //           },
  //         );
  //         break;
  //       case 'Feed':
  //         filter = {
  //           'resource.filename': filename,
  //         };
  //         targetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${filename}/${size}${ext}`;

  //         query = `resource.mipmap.x${size}`;

  //         data = await this.contentService.getContentModel().findOneAndUpdate(
  //           filter,
  //           {
  //             $set: { [query]: targetPath },
  //           },
  //           {
  //             upsert: false,
  //           },
  //         );
  //         break;
  //       case 'Exhibition':
  //         //TODO: 이미지가 바꼈지만 확장자가 동일해서 파일의 변화가 없는 경우, CloudFront 캐시 강제 갱신
  //         targetPath = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${schemaType}/${dirname}/${filename}/${size}${ext}`;
  //         const exhibition = await this.exhibitionModel.findOne({
  //           resourceId: dirname,
  //         });
  //         if (exhibition == null) {
  //           throw new Error(`no exhibition resource id : ${dirname}`);
  //         }
  //         if (filename === 'main') {
  //           //전시 메인 이미지
  //           exhibition.resourceMain.mipmap[`x${size}`] = targetPath;
  //         } else {
  //           //전시 포토 이미지
  //           exhibition.photoDetails[+filename].mipmap[`x${size}`] = targetPath;
  //         }
  //         await this.exhibitionModel.findByIdAndUpdate(
  //           exhibition._id,
  //           exhibition,
  //           { upsert: false },
  //         );
  //         break;
  //       default:
  //         break;
  //     }

  //     return {
  //       code: CodeStatus.GLOBAL_SUCCESS,
  //       message: StatusMessage.GLOBAL_SUCCESS,
  //       resourcePath: targetPath,
  //       data: data,
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       `[awsLambdaUpdateMipmapPath] : ${error.message}`,
  //       error.stack,
  //     );
  //     const log = {
  //       type: 'PathUpdateError',
  //       message: error.message,
  //       errorStack: error.stack,
  //       s3Key: `${schemaType} : ${filename}`,
  //     };

  //     await this.logModel.create(log);

  //     const coreResponseDto = new CoreResponseDto();
  //     coreResponseDto.code = CodeStatus.GLOBAL_SYSTEM_ERROR;
  //     coreResponseDto.message = error.message;
  //     coreResponseDto.errorStack = error.stack;
  //     return coreResponseDto;
  //   }
  // }

  // _generateResourcePathImage(resource, dirDepth: number) {
  //   const parsingData = parse(resource);

  //   let original = '';

  //   switch (dirDepth) {
  //     case 1:
  //       original = `${
  //         process.env.ARTTOKEN_RESOURCE_URI
  //       }images/original/${basename(parsingData.dir)}/${parsingData.base}`;
  //       break;
  //     case 2:
  //       original = `${
  //         process.env.ARTTOKEN_RESOURCE_URI
  //       }images/original/${basename(dirname(parsingData.dir))}/${basename(
  //         parsingData.dir,
  //       )}/${parsingData.base}`;
  //       break;
  //     default:
  //       break;
  //   }

  //   // const thumb64 = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${parsingData.name}/64${parsingData.ext}`;
  //   // const thumb256 = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${parsingData.name}/256${parsingData.ext}`;
  //   // const thumb512 = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${parsingData.name}/512${parsingData.ext}`;
  //   // const thumb1024 = `${process.env.ARTTOKEN_RESOURCE_URI}images/mipmap/${parsingData.name}/1024${parsingData.ext}`;

  //   //우선은 mipmap 이 생성되기전에 original path를 삽입하기
  //   const imageResource = {
  //     type: 'image',
  //     image: original,
  //     mipmap: {
  //       x64: original,
  //       x128: original,
  //       x256: original,
  //       x512: original,
  //       x1024: original,
  //     },
  //     smipmap: {
  //       x64: original,
  //       x128: original,
  //       x256: original,
  //       x512: original,
  //       x1024: original,
  //     },
  //     filename: parsingData.name,
  //   };
  //   return imageResource;
  // }

  // _generateResourcePathVideo(resource, dirDepth: number) {
  //   const parsingData = parse(resource);

  //   let original = '';

  //   switch (dirDepth) {
  //     case 1:
  //       original = `${
  //         process.env.ARTTOKEN_RESOURCE_URI
  //       }videos/original/${basename(parsingData.dir)}/${parsingData.base}`;
  //       break;
  //     case 2:
  //       original = `${
  //         process.env.ARTTOKEN_RESOURCE_URI
  //       }videos/original/${basename(basename(parsingData.dir))}/${basename(
  //         parsingData.dir,
  //       )}/${parsingData.base}`;
  //       break;
  //     default:
  //       break;
  //   }

  //   const thumb_dir = `${process.env.ARTTOKEN_RESOURCE_URI}videos/hls/${parsingData.name}`;

  //   const videoResource = {
  //     type: 'video',
  //     mipmap: {
  //       //TODO: 썸네일 생성중이라는 디폴트 IMAGE URL로 변경, 추후 썸네일 생성 후 Path 갱신
  //       // x64: `${thumb_dir}/Thumbnails_128/${parsingData.name}.0000000.jpg`,
  //       // x128: `${thumb_dir}/Thumbnails_128/${parsingData.name}.0000000.jpg`,
  //       // x256: `${thumb_dir}/Thumbnails_256/${parsingData.name}.0000000.jpg`,
  //       // x512: `${thumb_dir}/Thumbnails_512/${parsingData.name}.0000000.jpg`,
  //       // x1024: `${thumb_dir}/Thumbnails_1024/${parsingData.name}.0000000.jpg`,
  //       x64: ``,
  //       x128: ``,
  //       x256: ``,
  //       x512: ``,
  //       x1024: ``,
  //     },
  //     smipmap: {
  //       //TODO: 썸네일 생성중이라는 디폴트 IMAGE URL로 변경, 추후 썸네일 생성 후 Path 갱신
  //       // x64: `${thumb_dir}/Thumbnails_128/${parsingData.name}.0000000.jpg`,
  //       // x128: `${thumb_dir}/Thumbnails_128/${parsingData.name}.0000000.jpg`,
  //       // x256: `${thumb_dir}/Thumbnails_256/${parsingData.name}.0000000.jpg`,
  //       // x512: `${thumb_dir}/Thumbnails_512/${parsingData.name}.0000000.jpg`,
  //       // x1024: `${thumb_dir}/Thumbnails_1024/${parsingData.name}.0000000.jpg`,
  //       x64: ``,
  //       x128: ``,
  //       x256: ``,
  //       x512: ``,
  //       x1024: ``,
  //     },
  //     video: {
  //       origin: original,
  //       hls: {
  //         p480: original,
  //         p720: original,
  //         p1080: original,
  //         entire: original,
  //       },
  //       preview: {
  //         x128: original,
  //         x256: original,
  //         x512: original,
  //       },
  //     },
  //     filename: parsingData.name,
  //   };

  //   return videoResource;
  // }

  // _resourcePathGenerator(resource, resourceType, dirDepth: number) {
  //   // 로직 옮겨도 될 듯 여기로
  //   // const url = new URL(artwork.resource.Artwork);
  //   // const s3key = artwork.resource.Artwork.replace(`${url.origin}/`, '');

  //   // const fileInfo = await this.awsS3Service
  //   //   .getS3Client()
  //   //   .headObject({
  //   //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //   //     Key: s3key,
  //   //   })
  //   //   .promise();

  //   switch (resourceType) {
  //     case 'image':
  //       return this._generateResourcePathImage(resource, dirDepth);
  //     case 'video':
  //       return this._generateResourcePathVideo(resource, dirDepth);
  //     default:
  //       throw new HttpException(
  //         {
  //           message: `Invalid resource type [ ${resourceType} ]`,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //   }
  // }
}
