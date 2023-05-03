import { Request, Response } from 'express';
export default (req:Request, res:Response) => res.status(404).send({
  success: false,
  message: `Sorry, requested URL ${req.method} ${req.url} not found!`,
});
