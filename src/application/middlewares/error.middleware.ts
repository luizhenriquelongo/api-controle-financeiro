import { NextFunction, Request, Response } from 'express';
import APIException from '../exceptions/api.exception';

function errorMiddleware(
  error: APIException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.status(error.status).send({
    codigo: error.code,
    mensagem: error.message
  });
}

export default errorMiddleware;
