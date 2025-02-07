import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { BadRequestException } from '../lib/http-exception';
import { Request } from 'express';

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 ГБ

// Создаем папки, если их нет
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("converted")) fs.mkdirSync("converted");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (path.extname(file.originalname).toLowerCase() !== '.mov') {
        return cb(new BadRequestException('Допустимы только файлы .mov!'));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
});
