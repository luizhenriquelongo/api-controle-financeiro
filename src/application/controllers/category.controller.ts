import { Router, Response, Request, NextFunction } from 'express';
import { GetAllCategoriesUseCase } from '../use-cases/categories/get-all-categories';
import { CategoriesPostgresRepository } from '../repositories/categories.repository';
import { CreateCategoryUseCase } from '../use-cases/categories/create-category';
import { GetCategoryUseCase } from '../use-cases/categories/get-category';
import { DeleteCategoryUseCase } from '../use-cases/categories/delete-category';
import { UpdateCategoryUseCase } from '../use-cases/categories/update-category';
import APIException from '../exceptions/api.exception';
import { formatSuccessfulResponse } from '../utils';
import methodNotAllowed from '../middlewares/method-not-allowed.middleware';
import { GetCategoriesFilter } from '../use-cases/categories/types';
import { GetCategoriesWithFiltersUseCase } from '../use-cases/categories/get-categories-with-filters';
import {CategoryEntity} from "../../domain/entities/category";

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

    res.send(formatSuccessfulResponse(data));
  };

  public get = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const useCase = new GetCategoryUseCase(this.repository);
    const result = await useCase.execute({ categoryId: Number(id) });
    if (result instanceof APIException) return next(result);
    res.send(formatSuccessfulResponse(result.toDisplay()));
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name)
      return next(
        new APIException(400, `Property 'name' is required.`, 'ValidationError')
      );

    const useCase = new CreateCategoryUseCase(this.repository);
    const result = await useCase.execute({ name });
    res.status(201).send(formatSuccessfulResponse(result.toDisplay()));
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name)
      return next(
        new APIException(400, `Property 'name' is required.`, 'ValidationError')
      );

    const useCase = new UpdateCategoryUseCase(this.repository);
    const result = await useCase.execute({
      categoryId: Number(id),
      name
    });

    if (result instanceof APIException) return next(result);
    res.send(formatSuccessfulResponse(result.toDisplay()));
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const useCase = new DeleteCategoryUseCase(this.repository);
    const result = await useCase.execute({ categoryId: Number(id) });
    if (result instanceof APIException) return next(result);
    res.status(204).send();
  };

  public registerRoutes() {
    this.router.get('/', this.list);
    this.router.get('/:id', this.get);
    this.router.post('/', this.create);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
    this.router.all('/', methodNotAllowed);
  }
}
