import express, { Request, Response } from 'express';
import { CategoryController } from './application/controllers/category.controller';
import { postgresDataSource } from './database/data-source';
import 'reflect-metadata';
import errorMiddleware from './application/middlewares/error.middleware';

class Server {
  private app: express.Application;
  private categoryController: CategoryController;

  constructor() {
    this.app = express();
    this.configuration();
    this.categoryController = new CategoryController();
    this.registerRoutes();
  }

  public configuration() {
    this.app.set('port', process.env.PORT || 3000);
  }

  public async registerRoutes() {
    this.app.use(express.json());
    this.app.use('/v1/categorias', this.categoryController.router);
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Home Page!');
    });
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}

postgresDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    const server = new Server();
    server.start();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
