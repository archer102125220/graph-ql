import http from 'http';
import App from '@/app';

const app = new App();
const server = http.createServer(app);
server.listen(process.env.APP_POST || 4000, process.env.APP_HOST || '0.0.0.0');
server.on('error', onError);
server.on('listening', () => onListening(server));

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const port = process.env.APP_PORT || '3000';

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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
  const bind = addr?.port || addr;
  console.log(`✅  Running a GraphQL API server  at http://localhost:${bind}/graphql`);
}