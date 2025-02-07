import { NextFunction, Request, Response } from 'express';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '../../lib/http-exception';
import { videoServices } from './video.services';
import fs from 'fs';
import path from 'path';
import { logger } from '../../lib/logger';
import { deleteFile } from '../../lib/delete-file';

class VideoController {
    async downloadVideo(req: Request, res: Response, next: NextFunction) {
        const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB
        try {
            const filename = req.params.filename;
            const filepath = path.resolve('converted', filename);

            try {
                await fs.promises.access(filepath);
            } catch {
                throw new NotFoundException('Файл не найден');
            }

            const { size: fileSize } = await fs.promises.stat(filepath);

            logger.info(`Начинаем скачивание файла ${filename} (${fileSize} байт) чанками по ${CHUNK_SIZE} байт`);

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': fileSize,
                'Content-Disposition': `attachment; filename="${filename}"`,
            });

            const fileStream = fs.createReadStream(filepath, { highWaterMark: CHUNK_SIZE });

            fileStream.on('data', (chunk) => {
                res.write(chunk);
            });

            fileStream.on('end', () => {
                logger.info(`Файл ${filename} передан полностью`);
                deleteFile(filepath);
                res.end();
            });

            fileStream.on('error', (err) => {
                logger.error(`Ошибка при передаче файла ${filename}:`, err);
                throw new InternalServerErrorException('Произошла ошибка при передаче файла');
            });
        } catch (error) {
            next(error);
        }
    }

    async uploadVideo(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new BadRequestException('Файл не был загружен');
            }

            const { path } = req.file;
            const downloadUrl = await videoServices.uploadVideo(path);

            res.status(200).json({ download_url: downloadUrl });
        } catch (error) {
            next(error);
        }
    }
}

export const videoController = new VideoController();
