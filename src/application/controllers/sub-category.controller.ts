import { Router, Response, Request, NextFunction } from 'express';
import { CategoriesPostgresRepository } from '../repositories/categories.repository';
import APIException from '../exceptions/api.exception';
import methodNotAllowed from '../middlewares/method-not-allowed.middleware';
import { GetSubCategoriesWithFiltersUseCase } from '../use-cases/sub-categories/get-sub-categories-with-filters';
import { GetSubCategoriesFilter } from '../use-cases/sub-categories/types';
import { GetAllSubCategoriesUseCase } from '../use-cases/sub-categories/get-all-sub-categories';
import { SubCategoryEntity } from '../../domain/entities/sub-category';
import { SubCategoriesPostgresRepository } from '../repositories/sub-categories.repository';
import { GetSubCategoryUseCase } from '../use-cases/sub-categories/get-sub-category';
import { CreateSubCategoryUseCase } from '../use-cases/sub-categories/create-sub-category';
import { body, param, validationResult } from 'express-validator';
import { UpdateSubCategoryUseCase } from '../use-cases/sub-categories/update-sub-category';
import { DeleteSubCategoryUseCase } from '../use-cases/sub-categories/delete-sub-category';

export class SubCategoryController {
  public router: Router;
  private categoriesRepository: CategoriesPostgresRepository;
  private subCategoriesRepository: SubCategoriesPostgresRepository;

  constructor() {
    this.router = Router();
    this.categoriesRepository = new CategoriesPostgresRepository();
    this.subCategoriesRepository = new SubCategoriesPostgresRepository();
    this.registerRoutes();
  }

  public list = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new APIException(
          400,
          errors.array().map((error) => error.msg),
          'erro_validacao'
        )
      );
    const { nome, id_subcategoria } = req.query;
    const filters: GetSubCategoriesFilter = {};
    if (nome) filters.name = String(nome);
    if (id_subcategoria) filters.subCategoryId = Number(id_subcategoria);

    let subCategories: SubCategoryEntity[];
    if (filters !== {}) {
      const useCase = new GetSubCategoriesWithFiltersUseCase(
        this.subCategoriesRepository
      );
      subCategories = await useCase.execute(filters);
    } else {
      const useCase = new GetAllSubCategoriesUseCase(
        this.subCategoriesRepository
      );
      subCategories = await useCase.execute();
    }

    const data = subCategories.map((subCategory) => subCategory.toDisplay());

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
    const useCase = new GetSubCategoryUseCase(this.subCategoriesRepository);
    const result = await useCase.execute({ subCategoryId: Number(id) });

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

    const { nome, id_categoria } = req.body;

    const useCase = new CreateSubCategoryUseCase(
      this.categoriesRepository,
      this.subCategoriesRepository
    );
    const result = await useCase.execute({
      name: nome,
      categoryId: id_categoria
    });
    if (result instanceof APIException) return next(result);
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
    const { nome, id_categoria } = req.body;

    const useCase = new UpdateSubCategoryUseCase(
      this.categoriesRepository,
      this.subCategoriesRepository
    );
    const result = await useCase.execute({
      subCategoryId: Number(id),
      categoryId: Number(id_categoria),
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
    const useCase = new DeleteSubCategoryUseCase(this.subCategoriesRepository);
    const result = await useCase.execute({ subCategoryId: Number(id) });

    if (result instanceof APIException) return next(result);
    res.status(204).send();
  };

  public validate = (method: string) => {
    switch (method) {
      case 'list': {
        return [
          body(
            'id_subcategoria',
            "O campo 'id_subcategoria' deve ser um número inteiro."
          )
            .optional()
            .isInt()
        ];
      }
      case 'get': {
        return [
          param('id', 'O id da sub categoria deve ser um número inteiro')
            .exists()
            .isInt()
        ];
      }
      case 'create': {
        return [
          body('nome', "o campo 'nome' é obrigatório").exists(),
          body('id_categoria', "o campo 'id_categoria' é obrigatório").exists(),
          body(
            'id_categoria',
            'O campo id_categoria deve ser um número inteiro'
          )
        ];
      }
      case 'update': {
        return [
          param('id', 'O id da sub categoria deve ser um número inteiro')
            .exists()
            .isInt(),
          body(
            'id_categoria',
            "O campo 'id_categoria' deve ser um número inteiro"
          )
            .optional()
            .isInt()
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
    this.router.get('/', this.validate('list'), this.list);
    this.router.get('/:id', this.validate('get'), this.get);
    this.router.post('/', this.validate('create'), this.create);
    this.router.put('/:id', this.validate('update'), this.update);
    this.router.delete('/:id', this.validate('delete'), this.delete);
    this.router.all('/', methodNotAllowed);
  }
}
