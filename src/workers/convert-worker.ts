import workerpool from 'workerpool';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

async function convertVideo(inputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const outputPath = `converted/${path.basename(inputPath, '.mov')}.mp4`;

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}

// Регистрируем функцию в workerpool
workerpool.worker({ convertVideo });
