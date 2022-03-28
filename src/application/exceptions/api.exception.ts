import { ValidationError } from 'express-validator';

class APIException extends Error {
  status: number;
  errors: string[];
  code: string;

  constructor(status: number, errors: string[], code: string) {
    super(errors.toString());
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export default APIException;
