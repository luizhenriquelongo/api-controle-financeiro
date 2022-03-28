import { NextFunction, Request, Response } from 'express';
import APIException from '../exceptions/api.exception';

function errorMiddleware(
  error: APIException,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  response.status(error.status).send({
    codigo: error.code,
    mensagem: error.message
  });
}

export default errorMiddleware;
