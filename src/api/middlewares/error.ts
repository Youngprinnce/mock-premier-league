import { APIError } from "../../utils/api-errors";
import { Request, Response, NextFunction } from "express";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
export default (
  err: TypeError | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // log any kind of error
  const errorData = {
    date: new Date().toISOString(),
    env: process.env.NODE_ENV,
    level: "error",
    body: req.body,
    name: err.name,
    message: err.message,
    api: req.url,
    method: req.method,
    client: req.ip,
    stack: err.stack,
    cookies: req.cookies,
    headers: req.headers,
  };

  // log error to the console
  if(process.env.NODE_ENV !== 'test') console.error(errorData);

  // If response is already sent, don't attempt to respond to client
  if (res.headersSent) return next(err);

  // catch all else api errors
  if (err instanceof APIError)
    return res
      .status(err.status)
      .send({ success: false, message: err.message });

  // connect all errors
  return res
    .status(500)
    .send({ success: false, message: "Something went wrong!" });
};
