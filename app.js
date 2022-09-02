import Express from 'express';
import GraphQL from '@/graphql-app';

class App extends Express {
  constructor(props) {
    super(props);
    this.setMiddleware();
    this.setRoutes();
  }
  middlewareList = [
    (req, res, next) => {
      console.log('ip:', req.ip);
      next();
    }
  ];
  routeList = [
    ['/graphql', GraphQL(true)]
  ];

  setMiddleware = () => {
    this.middlewareList.forEach((middleware) => {
      if (Array.isArray(middleware)) {
        this.use(...middleware);
      } else {
        this.use(middleware);
      }
    });
  };

  setRoutes = () => {
    this.routeList.forEach((route) => {
      if (Array.isArray(route) && route.length === 2) {
        this.use(route[0], route[1]);
      } else if (Array.isArray(route)) {
        this.use(...route);
      } else {
        this.use(route);
      }
    });
  };
}

export default App;
