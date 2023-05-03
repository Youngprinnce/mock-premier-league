import 'dotenv/config';
import express, { Application } from 'express';
import expressLoader from './loaders/express';

const app: Application = express();

try {
  expressLoader({ app });
} catch (error) {
  console.error(error);
}

export default app;