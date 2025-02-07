import path from 'path';
import { deleteFile } from '../../lib/delete-file';
import { Worker } from 'worker_threads';
import { logger } from '../../lib/logger';

class VideoServices {
    async convertVideoMovToMp4(inputPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            logger.info(`Начата конвертацию видео: ${inputPath}`);
            const worker = new Worker(path.resolve(__dirname, 'convert-worker.mjs'), {
                workerData: { inputPath },
            });

            worker.on('message', (outputPath) => {
                logger.info(`Конвертация завершена: ${inputPath} в ${outputPath}`);
                resolve(outputPath);
            });
            worker.on('error', (err) => {
                logger.error(`Ошибка при конвертации файла ${inputPath}`);
                reject(err);
            });
            worker.on('exit', (code) => {
                if (code !== 0) reject(new Error(`Worker завершился с кодом ${code}`));
            });
        });
    }

    async generateUrlVideo(outputPath: string): Promise<string> {
        const fileName = path.basename(outputPath);
        return (process.env.API_URL || 'http://localhost:4000') + '/download/' + fileName;
    }

    async uploadVideo(inputPath: string): Promise<string> {
        try {
            const outputPath = await this.convertVideoMovToMp4(inputPath);
            deleteFile(inputPath);
            return this.generateUrlVideo(outputPath);
        } catch (error) {
            throw error;
        }
    }
}
export const videoServices = new VideoServices();
