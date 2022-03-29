import { Router, Response, Request, NextFunction } from 'express';
import { CategoriesPostgresRepository } from '../repositories/categories.repository';
import APIException from '../exceptions/api.exception';
import methodNotAllowed from '../middlewares/method-not-allowed.middleware';
import { SubCategoriesPostgresRepository } from '../repositories/sub-categories.repository';
import { query, validationResult } from 'express-validator';
import { EntriesPostgresRepository } from '../repositories/entries.repository';
import { parseDate } from '../utils';
import { GetBalanceFilters } from '../use-cases/balance/types';
import {
  GetBalanceByPeriodAndCategoryUseCase,
  GetBalanceByPeriodAndCategoryUseCaseRequest
} from '../use-cases/balance/get-balance-by-period-and-category';
import { BalanceEntity } from '../../domain/entities/balance';
import { GetBalanceByPeriodUseCase } from '../use-cases/balance/get-balance-by-period';

export class BalanceController {
  public router: Router;
  private categoriesRepository: CategoriesPostgresRepository;
  private subCategoriesRepository: SubCategoriesPostgresRepository;
  private entriesRepository: EntriesPostgresRepository;

  constructor() {
    this.router = Router();
    this.categoriesRepository = new CategoriesPostgresRepository();
    this.subCategoriesRepository = new SubCategoriesPostgresRepository();
    this.entriesRepository = new EntriesPostgresRepository();
    this.registerRoutes();
  }

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
    const { data_inicio, data_fim, id_categoria } = req.query;
    const filters: GetBalanceFilters = {
      startDate: parseDate(<string>data_inicio),
      endDate: parseDate(<string>data_fim)
    };
    if (id_categoria) filters.categoryId = Number(id_categoria);

    let balance: BalanceEntity | APIException;
    if (filters.categoryId) {
      const useCase = new GetBalanceByPeriodAndCategoryUseCase(
        this.entriesRepository,
        this.categoriesRepository,
        this.subCategoriesRepository
      );
      balance = await useCase.execute(
        <GetBalanceByPeriodAndCategoryUseCaseRequest>filters
      );
    } else {
      const useCase = new GetBalanceByPeriodUseCase(this.entriesRepository);
      balance = await useCase.execute(filters);
    }

    if (balance instanceof APIException) return next(balance);
    res.send(balance.toDisplay());
  };

  public validate = (method: string) => {
    switch (method) {
      case 'get': {
        return [
          query(
            'id_categoria',
            "O campo 'id_categoria' deve ser um número inteiro."
          )
            .optional()
            .isInt(),
          query('data_inicio', "O campo 'data_inicio' é obrigatório").exists(),
          query('data_fim', "O campo 'data_fim' é obrigatório").exists(),
          query(
            'data_inicio',
            "O campo 'data_inicio' deve ser uma data válida"
          ).isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
          query(
            'data_fim',
            "O campo 'data_fim' deve ser uma data válida"
          ).isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] })
        ];
      }
      default:
        return [];
    }
  };

  public registerRoutes() {
    this.router.get('/', this.validate('get'), this.get);
    this.router.all('/', methodNotAllowed);
  }
}
