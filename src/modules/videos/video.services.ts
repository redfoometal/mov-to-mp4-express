import path from 'path';
import workerpool from 'workerpool';
import { deleteFile } from '../../lib/delete-file';
import { logger } from '../../lib/logger';
import { InternalServerErrorException } from '../../lib/http-exception';

const workerScriptFile = require.resolve(path.join(__dirname, '../../workers/convert-worker'));

const pool = workerpool.pool(workerScriptFile, {
    workerType: 'thread',
    workerThreadOpts: {
        execArgv: /\.ts$/.test(workerScriptFile) ? ['--require', 'ts-node/register'] : undefined,
    },
});

class VideoServices {
    async convertVideoMovToMp4(inputPath: string): Promise<string> {
        try {
            logger.info(`Начата конвертация видео: ${inputPath}`);
            const outputPath = await pool.exec('convertVideo', [inputPath]);
            logger.info(`Конвертация завершена: ${inputPath} в ${outputPath}`);
            return outputPath;
        } catch (err: any) {
            logger.error(`Ошибка при конвертации файла ${inputPath}`);
            throw new InternalServerErrorException(err.message);
        }
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
