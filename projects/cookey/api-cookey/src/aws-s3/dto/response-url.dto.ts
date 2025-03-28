import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class AWS_POST_POLICY_FIELD {
  @ApiProperty({
    description: "s3DestKey",
    type: String,
    example: "videos/original/Artwork/64861664-0684-4eaa-b6f1-0357573b86f6.mov",
  })
  s3DestKey: string;

  @ApiProperty({
    description: "S3 Bucket name",
    type: String,
    example: '"arttoken-resource',
  })
  bucket: string;

  @ApiProperty({
    description: "X-Amz-Algorithm",
    type: String,
    example: "AWS4-HMAC-SHA256",
  })
  "X-Amz-Algorithm": string;

  @ApiProperty({
    description: "X-Amz-Credential",
    type: String,
    example: "AKIAVFW62EGVIHNOXC5E/20221013/ap-northeast-2/s3/aws4_request",
  })
  "X-Amz-Credential": string;

  @ApiProperty({
    description: "X-Amz-Date",
    type: String,
    example: "20221013T082855Z",
  })
  "X-Amz-Date": string;

  @ApiProperty({
    description: "Policy",
    type: String,
    example:
      "eyJleHBpcmF0aW9uIjoiMjAyMi0xMC0xM1QwODoyOTowMFoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwyMDAwMDAwMDBdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwidmlkZW8vIl0seyJzM0Rlc3RLZXkiOiJ2aWRlb3Mvb3JpZ2luYWwvQXJ0d29yay82NDg2MTY2NC0wNjg0LTRlYWEtYjZmMS0wMzU3NTczYjg2ZjYubW92In0seyJidWNrZXQiOiJhcnR0b2tlbi1yZXNvdXJjZSJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFWRlc2MkVHVklITk9YQzVFLzIwMjIxMDEzL2FwLW5vcnRoZWFzdC0yL3MzL2F3czRfcmVxdWVzdCJ9LHsiWC1BbXotRGF0ZSI6IjIwMjIxMDEzVDA4Mjg1NVoifV19",
  })
  Policy: string;

  @ApiProperty({
    description: "Policy",
    type: String,
    example: "84c64713217e14051797d1e881a2759f0329774442c888f1558cf6a628ea2cf9",
  })
  "X-Amz-Signature": string;
}

export class AWS_POST_POLICY_BODY {
  @ApiProperty({
    description: "s3 signed URL",
    type: String,
    example:
      "https://arttoken-resource.s3.ap-northeast-2.amazonaws.com/ArtworkResources/origin/0869efdd-662d-44b8-a357-f49524ba4251.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVFW62EGVIHNOXC5E%2F20220919%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220919T075659Z&X-Amz-Expires=30&X-Amz-Signature=da51a7cde49be0859df6e15744a15b0e17e82f27480dd247197830796c1665b1&X-Amz-SignedHeaders=host",
  })
  url: string;

  @ApiProperty({
    description: "AWS_POST_POLICY_FIELD",
    type: AWS_POST_POLICY_FIELD,
  })
  fields: AWS_POST_POLICY_FIELD;
}

export class ResponseUrlDto extends CoreResponseDto {
  @ApiProperty({
    description: "s3 signed URL",
    type: String,
    example:
      "https://arttoken-resource.s3.ap-northeast-2.amazonaws.com/ArtworkResources/origin/0869efdd-662d-44b8-a357-f49524ba4251.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVFW62EGVIHNOXC5E%2F20220919%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220919T075659Z&X-Amz-Expires=30&X-Amz-Signature=da51a7cde49be0859df6e15744a15b0e17e82f27480dd247197830796c1665b1&X-Amz-SignedHeaders=host",
  })
  @IsUrl()
  signedUrl: string;

  @ApiProperty({
    description: "resouce access url",
    type: String,
    example:
      "https://arttoken-resource.s3.ap-northeast-2.amazonaws.com/ArtworkResources/origin/0869efdd-662d-44b8-a357-f49524ba4251.mov",
  })
  @IsUrl()
  accessUrl: string;
}

export class ResponseUrlMultiDto extends CoreResponseDto {
  @ApiProperty({
    description: "s3 signed URL List",
    type: String,
    // example:
    //   'https://arttoken-resource.s3.ap-northeast-2.amazonaws.com/ArtworkResources/origin/0869efdd-662d-44b8-a357-f49524ba4251.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVFW62EGVIHNOXC5E%2F20220919%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220919T075659Z&X-Amz-Expires=30&X-Amz-Signature=da51a7cde49be0859df6e15744a15b0e17e82f27480dd247197830796c1665b1&X-Amz-SignedHeaders=host',
  })
  signedUrls;
}

export class ResponsePreSignedPostUrlDto extends CoreResponseDto {
  @ApiProperty({
    description: "s3 presinged body",
    type: AWS_POST_POLICY_BODY,
  })
  presignedUrlBody;
}
