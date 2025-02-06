import { NextFunction, Request, Response } from 'express';
import { BadRequestException, InternalServerErrorException } from '../../lib/http-exception';

class VideoController {
    async downloadVideo(req: Request, res: Response, next: NextFunction) {
        try {
            throw new InternalServerErrorException();
        } catch (error) {
            next(error);
        }
    }

    async uploadVideo(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.file);
        } catch (error) {
            next(error);
        }
    }
}

export const videoController = new VideoController();
