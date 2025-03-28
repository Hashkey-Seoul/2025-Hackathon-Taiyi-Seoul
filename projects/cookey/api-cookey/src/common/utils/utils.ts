import https from 'https';
import fs from 'fs';

export function addslashes(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const BLOCKCHAIN_TIME_OFFSET = 1000;

export function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      })
      .on('error', (err) => {
        fs.unlink(destPath, () => reject(err.message));
      });
  });
}
