import { utilities, WinstonModule } from "nest-winston";
import winstonDaily from "winston-daily-rotate-file";
import winston from "winston";
import CloudWatchTransport from "winston-cloudwatch";

const env = process.env.NODE_ENV;
const logDir = __dirname + "/../../logs"; // log 파일을 관리할 폴더
const koreanTime = () =>
  new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });

const dailyOptions = (level: string) => {
  return {
    level,
    format:
      env === "production"
        ? // production 환경은 자원을 아끼기 위해 simple 포맷 사용
          winston.format.simple()
        : winston.format.combine(
            winston.format.json(),
            winston.format.timestamp({ format: koreanTime }),

            utilities.format.nestLike("Cookey", {
              prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
            }),
          ),
    datePattern: "YYYY-MM-DD",
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 365, //1년치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};

// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === "production" ? "http" : "silly",
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      format:
        env === "production"
          ? // production 환경은 자원을 아끼기 위해 simple 포맷 사용
            winston.format.simple()
          : winston.format.combine(
              winston.format.colorize({ all: true }),
              winston.format.timestamp(),

              utilities.format.nestLike("Cookey", {
                prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
              }),
            ),
    }),

    // info, debug, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions("info")),
    new winstonDaily(dailyOptions("debug")),
    new winstonDaily(dailyOptions("warn")),
    new winstonDaily(dailyOptions("error")),
    new CloudWatchTransport({
      name: "Cloudwatch API ",
      awsOptions: {
        credentials: {
          accessKeyId: process.env.AWS_CLOUDWATCH_KEY_ID,
          secretAccessKey: process.env.AWS_CLOUDWATCH_ACCESS_KEY,
        },
      },
      logGroupName: process.env.AWS_CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.AWS_CLOUDWATCH_STREAM_NAME,
      awsRegion: process.env.AWS_REGION,
      messageFormatter: function (item) {
        return item.level + ": " + item.message + " " + JSON.stringify(item);
      },
    }),
  ],
});
