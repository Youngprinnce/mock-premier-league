import redisRepository from "../redis";
import { Request, Response, NextFunction } from 'express';

/**
 * @method function
 * @param {string} prefix - Prefix added to make the key stored in the store unique, if not provided, default is used.
 * @param {number} allowedHits - The number of requests the user can make to the API before their access to the API is blocked.
 * @param {number} secondsWindow - The windows in seconds the user is granted access to the API from their first call to the API.
 **/
export default function rateLimiter({secondsWindow, allowedHits, prefix = ''}: {
  secondsWindow: number, allowedHits: number, prefix?:string
}) {
  return async (req:Request, res:Response, next:NextFunction) => {
    if(process.env.NODE_ENV !== 'test' && req.authUser.role === 'user') {
      const ip = req.socket.remoteAddress as string;
      const key = `${prefix || ip}_${ip}`;

      // limit users requests based on their email, if not available, use the userId, if not available, use the ip
      const numRequests = await redisRepository.redisAIncr({key});

      let ttl:number
      // noinspection JSIncompatibleTypesComparison
      if (numRequests === 1) {
        // Set time you want the key to expire in seconds
        await redisRepository.redisExpire({key, expire: secondsWindow});
        ttl = secondsWindow;
      } else {
        // Get the time left before the key expires in seconds
        ttl = await redisRepository.redisTTL({key});
      }

      const hours = Math.floor(ttl / 3600);
      const minutes = Math.floor((ttl - hours * 3600) / 60);
      const seconds = ttl % 60;

      const remainderTime = minutes < 1 ? `${seconds} seconds.` : hours >= 1 ? `${hours} hour, ${minutes} minutes, ${seconds} seconds..` : `${minutes} minute, ${seconds} seconds.`;
      const message = `too many requests made to our server, please try again in ${remainderTime}`;

      if (numRequests > allowedHits) return res.status(429).json({message, success: false});
    }
    next()
  }
}
