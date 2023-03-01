/* eslint-disable no-unused-vars */
import { JsonWebTokenError } from 'jsonwebtoken';
import { ErroNaoAutorizacao } from '../../errors/ErroNaoAutorizacao';
import { ErroParametrosInvalidos } from '../../errors/ErroParametrosInvalidos';
import { ErroToken } from '../../errors/ErroToken';
import { ErroQuery } from '../../errors/ErroQuery';
import statusCodes from '../../utils/constants/statusCodes';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  let message = error.message;
  let status = statusCodes.INTERNAL_SERVER_ERROR;

  if (error instanceof JsonWebTokenError ||
    error instanceof ErroNaoAutorizacao) {
    status = statusCodes.FORBIDDEN;
  }

  if (error instanceof ErroParametrosInvalidos) {
    status = statusCodes.BAD_REQUEST;
  }

  if (error instanceof ErroToken) {
    status = statusCodes.NOT_FOUND;
  }

  if (error instanceof ErroQuery) {
    status = statusCodes.BAD_REQUEST;
  }

  console.log(error);
  res.status(status).json(message);
}