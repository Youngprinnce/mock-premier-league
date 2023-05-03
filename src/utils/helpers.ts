import { UnProcessableEntityError } from './api-errors';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new UnProcessableEntityError(errors.array()[0].msg));
  }
  return next();
};

/**
 * @description responseData method formats the response data
 * @method function
 * @param {string} message - Message describing the response data
 * @param {number} status - Status code integer
 * @param {boolean} success - show if request return as intended (i.e ok)
 * @param {object} data - object data sent to the client
 * @return {Object} - formatted data object
 * */
export const responseData = ({ message = 'data fetched', success = true, status = 200, data = {} }) => {
  return {
    message,
    status,
    success,
    ...data
  };
};