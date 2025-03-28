// 안쓰는 파일, 코드 참고용으로만 현재 사용중 2023.2.3

// import fs from 'fs';
// import winston from 'winston';

// const logDir = __dirname + '/../logs';

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

// const infoTransport = new winston.transports.File({
//   filename: 'info.log',
//   dirname: logDir,
//   level: 'info',
// });

// const errorTransport = new winston.transports.File({
//   filename: 'error.log',
//   dirname: logDir,
//   level: 'error',
// });

// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.json(),
//     winston.format.timestamp(),
//   ),
//   transports: [infoTransport, errorTransport],
// });

// const stream = {
//   write: (message) => {
//     logger.info(message);
//   },
// };

// export { logger, stream };
