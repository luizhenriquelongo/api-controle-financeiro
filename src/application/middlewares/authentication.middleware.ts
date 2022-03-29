import { NextFunction, Request, Response } from 'express';
import APIException from '../exceptions/api.exception';
import { API_KEY } from '../../config';

function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const api_key = request.header('api-key');
  const message = api_key
    ? 'api-key inválido'
    : 'uma api-key é obrigatória para realizar requisicoes';
  if (api_key !== API_KEY)
    return next(new APIException(401, [message], 'erro_autenticacao'));
  next();
}

export default authenticationMiddleware;
