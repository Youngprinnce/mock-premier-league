import http from 'http';
import app from '../app';
import debug from 'debug';
import mongoose from 'mongoose';
import seeder from '../api/seed';
import normalizePort from '../utils/normalize-port';
import gracefulShutdown from 'http-graceful-shutdown';
import { preShutdown, onShutdown } from '../utils/graceful-shutdown';

const DB_DEV = process.env.DB_DEV;
const DB_TEST = process.env.DB_TEST;
const DB_PRODUCTION = process.env.DB_PRODUCTION;

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

const DB_NAME_DEV = process.env.DB_NAME_DEV;
const DB_NAME_TEST = process.env.DB_NAME_TEST;
const DB_NAME_PRODUCTION = process.env.DB_NAME_PRODUCTION;

const dbName = NODE_ENV === 'development' ? DB_NAME_DEV : NODE_ENV === 'test' ? DB_NAME_TEST :  DB_NAME_PRODUCTION;
const dbUrl = NODE_ENV === 'development' ? String(DB_DEV) : NODE_ENV === 'test' ? String(DB_TEST) : String(DB_PRODUCTION);

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName,
};

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);

// Connect to MongoDB and start HTTP server
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, dbOptions).then(() => {
  server.listen(normalizePort(PORT));
  console.log(`DB connected, and server is on port:${PORT}`);
  if(NODE_ENV !== 'test') seeder();
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Handle signal events gracefully
gracefulShutdown(server, {
  signals: 'SIGINT SIGTERM, SIGKILL, SIGHUP',   // signals for shutting the server
  development: false,                           // not in dev mode
  forceExit: false,                             // triggers process.exit() at the end of shutdown process if true
  timeout: 10000,                               // timeout: 10 secs
  preShutdown,                                  // needed operation before httpConnections shuts down
  onShutdown,                                   // shutdown function (async) - e.g. for cleanup DB, ...
});

// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port}`;
  debug('Listening on ' + bind);
}

export default server
