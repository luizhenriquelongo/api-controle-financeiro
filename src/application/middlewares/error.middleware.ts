import { NextFunction, Request, Response } from 'express';
import APIException from '../exceptions/api.exception';

function errorMiddleware(
  error: APIException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const customError = !(
    error.constructor.name === 'NodeError' ||
    error.constructor.name === 'SyntaxError'
  );
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const raw_type = !customError ? 'UnhandledError' : error.constructor.name;

  response.status(status).send({
    response: 'error',
    error: {
      type: error.type ? error.type : raw_type,
      path: request.path,
      status_code: status,
      message: message
    }
  });
}

export default errorMiddleware;
