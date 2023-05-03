import cors from 'cors';
import morgan from 'morgan';
const {NODE_ENV} =  process.env;
import routes from '../v1.routes';
import enforce from 'express-sslify';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import redisRepository from "../api/redis/index";
import express, {Application,Request,Response} from 'express';
import { errorHandler, notFoundHandler, badJsonHandler, timedout} from "../api/middlewares";

export default ({app}: {app: Application}) => {
  
  // Middlewares
  app.use(timedout);
  app.use(express.json());
  app.use(cookieParser());
  app.disable('x-powered-by');
  app.use(bodyParser.json({limit: "20mb"}));
  app.use(express.urlencoded({extended: false}));
  app.use(cors({origin: true, credentials: true}));
  app.use(bodyParser.urlencoded({extended: true, limit: "20mb"}));
  app.use(morgan(NODE_ENV !== 'development' ? 'combined' : 'dev'));

  // Enforce SSL for Heroku
  if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
    app.use(enforce.HTTPS({trustProtoHeader: true}));
  }

  // Catch bad JSON requests
  app.use(badJsonHandler);

  // Session storage
  if (NODE_ENV !== 'test') app.use(redisRepository.session)
  
  // APIs
  routes({app});

  app.get('/',  (req:Request,res:Response) => {
    res.status(200).json({message: "welcome"})
  });

  // Catch 404 errors
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);
};
