import { parentPort, workerData } from 'worker_threads';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const { inputPath } = workerData;
const outputPath = `converted/${path.basename(inputPath, '.mov')}.mp4`;

ffmpeg('inputPath')
    .videoCodec('libx264')
    .on('end', () => {
        parentPort?.postMessage(outputPath);
    })
    .on('error', (err) => {
        throw err;
    })
    .save(outputPath);
