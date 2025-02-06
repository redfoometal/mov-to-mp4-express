import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpException, InternalServerErrorException } from '../lib/http-exception';
import { logger } from '../lib/logger';

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
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
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
        stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : {}) : {},
    });
    return;
};
