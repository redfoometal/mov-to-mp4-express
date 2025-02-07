import { rimraf } from 'rimraf';
import { logger } from './logger';

export async function deleteFile(filePath: string): Promise<void> {
    try {
        logger.info(`Удаление файла: ${filePath}`);
        await rimraf(filePath);
    } catch (err) {
        logger.error({ err, message: `Не удалось удалить файл ${filePath}` });
        throw err;
    }
}
