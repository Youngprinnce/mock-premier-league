import { UnProcessableEntityError } from './api-errors';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import redisRepository from '../api/redis'

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

export async function getCache({req}:{req: Request}) {
  const url = generateCacheKey(req);
  try {
    const data = await redisRepository.getRedisAsync({key: url});
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error retrieving cache for key ${url}:`, error);
  }
  return null;
}

export async function cacheData({req, data}: {req: Request, data: any}) {
  const url = generateCacheKey(req);
  try {
    await redisRepository.setRedisAsync({key: url, value: JSON.stringify(data), expiry: 3600});
  } catch (error) {
    console.error(`Error caching data for key ${url}:`, error);
  }
}

function generateCacheKey(req: Request): string {
  return req.get('host') + req.originalUrl;
}
