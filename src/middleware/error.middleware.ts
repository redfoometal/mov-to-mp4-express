import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpException, InternalServerErrorException } from '../lib/http-exception';
import { logger } from '../lib/logger';
import { MulterError } from 'multer';

const multerErrorMessagesMap = new Map([
    ['LIMIT_FILE_SIZE', 'Файл слишком большой!'],
    ['LIMIT_FILE_COUNT', 'Можно загружать только один файл!'],
]);

export const errorMiddleware: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
        logger.error({
            err,
            method: req.method,
            url: req.url,
            statusCode: err.statusCode,
        });

        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
        return;
    }

    if (err instanceof MulterError) {
        logger.error({
            err,
            method: req.method,
            url: req.url,
        });

        const message = multerErrorMessagesMap.get(err.code) || 'Что то пошло не так при загрузке видео';

        res.status(400).json({
            success: false,
            status: 'error',
            message,
        });
        return;
    }

    logger.fatal({
        err,
        method: req.method,
        url: req.url,
    });

    const internalError = new InternalServerErrorException();

    res.status(internalError.statusCode).json({
        success: false,
        status: internalError.status,
        message: internalError.message,
    });
    return;
};
