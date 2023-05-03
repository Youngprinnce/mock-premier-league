import { TimeoutError } from "../../utils/api-errors";
import { Request, Response, NextFunction } from "express";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */

export default (req: Request, res: Response, next: NextFunction) => {
  // keep the connection alive for 29.5 seconds before throwing timedout error, to mitigate Heroku time out limit of 30s
  const timeoutMs = 29500; // 29.5 seconds
  const timeout = setTimeout(() => {
    next(new TimeoutError("your internet connectivity is slow, try again"));
  }, timeoutMs);

  res.on("finish", () => {
    clearTimeout(timeout);
  });
  next();
};
