import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const methodNotAllowed = (req: Request, res: Response, next: NextFunction) =>
  res.status(405).send({
    response: 'error',
    error: {
      type: 'MethodNotAllowed',
      path: req.originalUrl,
      status_code: 405,
      message: `The ${req.method} method for the "${req.originalUrl}" route is not allowed.`
    }
  });

export default methodNotAllowed;
