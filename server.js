import http from 'http';
import App from '@/app';

const app = new App();
const server = http.createServer(app);
server.listen(4000, process.env.APP_HOST || '0.0.0.0');
server.on('error', onError);
server.on('listening', () => onListening(server));
// server.on('request', (request, response) => ipLog(request, response));

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const port = normalizePort(process.env.APP_PORT || '3000');

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log('EACCES');
      console.log(error);
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log('EADDRINUSE');
      console.log(error);
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      console.log('default');
      console.log(error);
      throw error;
  }
}

function onListening(services) {
  const addr = services.address();
  const bind = typeof addr === 'string' ? addr : addr.port;
  console.log(`✅  Running a GraphQL API server  at http://localhost:${bind}/graphql`);
}

function ipLog(request) {
  console.log('-------------ip log---------------');
  console.log('a user from :');
  console.log(`${request.connection.remoteAddress}:${request.connection.remotePort}`);
  //console.log('connection:');
  //console.log(request.connection);
  //console.log(request.headers["x-forwarded-for"],request.headers["X-Forwarded-Port"]);
  console.log('headers:');
  console.log(request.headers);
  //console.log(request.connection);
  console.log('-------------ip log end---------------');
}
