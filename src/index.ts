import express, { Express } from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { videoRouter } from './modules/videos/video.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/', videoRouter);
app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`[server]: Server is running at ${port} port`);
});
