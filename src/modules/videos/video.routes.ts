import { Router } from 'express';
import { videoController } from './video.controller';
import { upload } from '../../middleware/upload.middleware';

const videoRouter = Router();

videoRouter.get('/download/:filename', videoController.downloadVideo.bind(videoController));
videoRouter.post('/upload', upload.single('video'), videoController.uploadVideo.bind(videoController));

export { videoRouter };
