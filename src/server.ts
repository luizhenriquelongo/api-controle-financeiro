import express, { Request, Response } from 'express';
import { CategoryController } from './application/controllers/category.controller';
import { postgresDataSource } from './database/data-source';
import 'reflect-metadata';
import errorMiddleware from './application/middlewares/error.middleware';
import { SubCategoryController } from './application/controllers/sub-category.controller';
import { EntryController } from './application/controllers/entry.controller';
import { BalanceController } from './application/controllers/balance.controller';
import authenticationMiddleware from './application/middlewares/authentication.middleware';
import swaggerDocs from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

class Server {
  private app: express.Application;
  private categoryController: CategoryController;
  private subCategoryController: SubCategoryController;
  private entryController: EntryController;
  private balanceController: BalanceController;

  constructor() {
    this.app = express();
    this.configuration();
    this.categoryController = new CategoryController();
    this.subCategoryController = new SubCategoryController();
    this.entryController = new EntryController();
    this.balanceController = new BalanceController();
    this.registerRoutes();
  }

  public configuration() {
    this.app.set('port', process.env.PORT || 3000);
  }

  public async registerRoutes() {
    this.app.use(express.json());
    this.app.use(cors());

    this.app.get('/', (req: Request, res: Response) =>
      res.redirect('/v1/docs')
    );
    this.app.use(
      '/v1/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs, { explorer: true })
    );
    this.app.use(authenticationMiddleware);
    this.app.use('/v1/categorias', this.categoryController.router);
    this.app.use('/v1/subcategorias', this.subCategoryController.router);
    this.app.use('/v1/lancamentos', this.entryController.router);
    this.app.use('/v1/balanco', this.balanceController.router);

    this.app.get('/health', (req: Request, res: Response) => {
      res.send({ response: 'ok' });
    });
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(this.app.get('port'), () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}
const initServer = async () => {
  await postgresDataSource.initialize();
  await postgresDataSource.runMigrations();

  const server = new Server();
  server.start();
};

initServer();
