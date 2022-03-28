import { Router, Response, Request, NextFunction } from 'express';
import { GetAllCategoriesUseCase } from '../use-cases/categories/get-all-categories';
import { CategoriesPostgresRepository } from '../repositories/categories.repository';
import { CreateCategoryUseCase } from '../use-cases/categories/create-category';
import { GetCategoryUseCase } from '../use-cases/categories/get-category';
import { DeleteCategoryUseCase } from '../use-cases/categories/delete-category';
import { UpdateCategoryUseCase } from '../use-cases/categories/update-category';
import APIException from '../exceptions/api.exception';
import methodNotAllowed from '../middlewares/method-not-allowed.middleware';
import { GetCategoriesWithFiltersUseCase } from '../use-cases/categories/get-categories-with-filters';
import { CategoryEntity } from '../../domain/entities/category';
import { body, param, validationResult } from 'express-validator';

export class CategoryController {
  public router: Router;
  private repository: CategoriesPostgresRepository;

  constructor() {
    this.router = Router();
    this.repository = new CategoriesPostgresRepository();
    this.registerRoutes();
  }

  public list = async (req: Request, res: Response) => {
    const { nome } = req.query;
    let categories: CategoryEntity[];
    if (nome) {
      const useCase = new GetCategoriesWithFiltersUseCase(this.repository);
      categories = await useCase.execute({ name: String(nome) });
    } else {
      const useCase = new GetAllCategoriesUseCase(this.repository);
      categories = await useCase.execute();
    }

    const data = categories.map((category) => category.toDisplay());

    res.send(data);
  };

  public get = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new APIException(
          400,
          errors.array().map((error) => error.msg),
          'erro_validacao'
        )
      );

    const { id } = req.params;
    const useCase = new GetCategoryUseCase(this.repository);
    const result = await useCase.execute({ categoryId: Number(id) });

    if (result instanceof APIException) return next(result);
    res.send(result.toDisplay());
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new APIException(
          400,
          errors.array().map((error) => error.msg),
          'erro_validacao'
        )
      );
    const { nome } = req.body;

    const useCase = new CreateCategoryUseCase(this.repository);
    const result = await useCase.execute({ name: nome });
    res.status(201).send(result.toDisplay());
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new APIException(
          400,
          errors.array().map((error) => error.msg),
          'erro_validacao'
        )
      );

    const { id } = req.params;
    const { nome } = req.body;

    const useCase = new UpdateCategoryUseCase(this.repository);
    const result = await useCase.execute({
      categoryId: Number(id),
      name: nome
    });

    if (result instanceof APIException) return next(result);
    res.send(result.toDisplay());
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new APIException(
          400,
          errors.array().map((error) => error.msg),
          'erro_validacao'
        )
      );

    const { id } = req.params;
    const useCase = new DeleteCategoryUseCase(this.repository);
    const result = await useCase.execute({ categoryId: Number(id) });
    if (result instanceof APIException) return next(result);
    res.status(204).send();
  };

  public validate = (method: string) => {
    switch (method) {
      case 'get': {
        return [
          param('id', 'O id da categoria deve ser um número inteiro')
            .exists()
            .isInt()
        ];
      }
      case 'create': {
        return [body('nome', "o campo 'nome' é obrigatório").exists()];
      }
      case 'update': {
        return [
          param('id', 'O id da categoria deve ser um número inteiro')
            .exists()
            .isInt(),
          body('nome', "o campo 'nome' é obrigatório").exists()
        ];
      }
      case 'delete': {
        return [
          param('id', 'O id da categoria deve ser um número inteiro')
            .exists()
            .isInt()
        ];
      }
      default:
        return [];
    }
  };

  public registerRoutes() {
    this.router.get('/', this.list);
    this.router.get('/:id', this.validate('get'), this.get);
    this.router.post('/', this.validate('create'), this.create);
    this.router.put('/:id', this.validate('update'), this.update);
    this.router.delete('/:id', this.validate('delete'), this.delete);
    this.router.all('/', methodNotAllowed);
  }
}
