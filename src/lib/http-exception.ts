interface IHttpException {
    statusCode: number;
    status: 'fail' | 'error';
    isOperational: boolean;
}

class HttpException extends Error implements IHttpException {
    public readonly statusCode: number;
    public readonly status: 'fail' | 'error';
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

function createHttpException(name: string, statusCode: number, defaultMessage: string) {
    return class extends HttpException {
        constructor(message: string = defaultMessage) {
            super(message, statusCode);
            this.name = name;
        }
    };
}

const BadRequestException = createHttpException('BadRequestException', 400, 'Некорректный запрос');
const NotFoundException = createHttpException('NotFoundException', 404, 'Ресурс не найден');
const InternalServerErrorException = createHttpException('InternalServerErrorException', 500, 'Внутренняя ошибка сервера');

export { HttpException, BadRequestException, NotFoundException, InternalServerErrorException, IHttpException };
