import { Router, Response, Request, NextFunction } from 'express';
import APIException from '../exceptions/api.exception';
import methodNotAllowed from '../middlewares/method-not-allowed.middleware';
import { SubCategoriesPostgresRepository } from '../repositories/sub-categories.repository';
import { body, param, query, validationResult } from 'express-validator';
import { GetEntriesFilter } from '../use-cases/entry/types';
import { EntryEntity } from '../../domain/entities/entry';
import { GetAllEntriesUseCase } from '../use-cases/entry/get-all-entries';
import { GetEntriesWithFiltersUseCase } from '../use-cases/entry/get-all-entries-with-filters';
import { EntriesPostgresRepository } from '../repositories/entries.repository';
import { GetEntryUseCase } from '../use-cases/entry/get-entry';
import {
  CreateEntryUseCase,
  CreateEntryUseCaseRequest
} from '../use-cases/entry/create-entry';
import Decimal from 'decimal.js';
import {
  UpdateEntryUseCase,
  UpdateEntryUseCaseRequest
} from '../use-cases/entry/update-entry';
import { DeleteEntryUseCase } from '../use-cases/entry/delete-entry';
import { parseDate } from '../utils';

export class EntryController {
  public router: Router;
  private subCategoriesRepository: SubCategoriesPostgresRepository;
  private entriesRepository: EntriesPostgresRepository;

  constructor() {
    this.router = Router();
    this.subCategoriesRepository = new SubCategoriesPostgresRepository();
    this.entriesRepository = new EntriesPostgresRepository();
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
    const { data_inicio, data_fim, id_subcategoria } = req.query;
    const filters: GetEntriesFilter = {};
    if (data_inicio) filters.start_date = parseDate(<string>data_inicio);
    if (data_fim) filters.end_date = parseDate(<string>data_fim);
    if (id_subcategoria) filters.subCategoryId = Number(id_subcategoria);

    let entries: EntryEntity[];
    if (filters !== {}) {
      const useCase = new GetEntriesWithFiltersUseCase(this.entriesRepository);
      entries = await useCase.execute(filters);
    } else {
      const useCase = new GetAllEntriesUseCase(this.entriesRepository);
      entries = await useCase.execute();
    }

    const data = entries.map((entry) => entry.toDisplay());

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
    const useCase = new GetEntryUseCase(this.entriesRepository);
    const result = await useCase.execute({ entryId: Number(id) });

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

    const { valor, id_subcategoria, comentario, data } = req.body;

    const params: CreateEntryUseCaseRequest = {
      value: new Decimal(valor),
      subCategoryId: Number(id_subcategoria)
    };

    if (data) params.date = parseDate(data);
    if (comentario) params.comment = comentario;

    const useCase = new CreateEntryUseCase(
      this.entriesRepository,
      this.subCategoriesRepository
    );
    const result = await useCase.execute(params);

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
    const { valor, id_subcategoria, data, comentario } = req.body;

    const useCase = new UpdateEntryUseCase(
      this.entriesRepository,
      this.subCategoriesRepository
    );
    const params: UpdateEntryUseCaseRequest = {
      entryId: Number(id)
    };

    if (valor) params.value = new Decimal(valor);
    if (id_subcategoria) params.subCategoryId = Number(id_subcategoria);
    if (data) params.date = parseDate(data);
    if (comentario) params.comment = comentario;

    const result = await useCase.execute(params);

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
    const useCase = new DeleteEntryUseCase(this.entriesRepository);
    const result = await useCase.execute({ entryId: Number(id) });

    if (result instanceof APIException) return next(result);
    res.status(204).send();
  };

  public validate = (method: string) => {
    switch (method) {
      case 'list': {
        return [
          query(
            'id_subcategoria',
            "O campo 'id_subcategoria' deve ser um número inteiro."
          )
            .optional()
            .isInt(),
          query('data_inicio', "O campo 'data_inicio' deve ser uma data válida")
            .optional()
            .isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
          query('data_fim', "O campo 'data_fim' deve ser uma data válida")
            .optional()
            .isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] })
        ];
      }
      case 'get': {
        return [
          param('id', 'O id do lancamento ser um número inteiro')
            .exists()
            .isInt()
        ];
      }
      case 'create': {
        return [
          body('valor', "o campo 'valor' é obrigatório").exists(),
          body('valor', "o campo 'valor' deve ser um número.").isNumeric(),
          body('data', "o campo 'data' deve ser uma data válida")
            .optional()
            .isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
          body(
            'id_subcategoria',
            "O campo 'id_subcategoria' é obrigatório"
          ).exists(),
          body(
            'id_subcategoria',
            'O campo id_categoria deve ser um número inteiro'
          ).isInt()
        ];
      }
      case 'update': {
        return [
          param('id', 'O id do lancamento deve ser um número inteiro')
            .exists()
            .isInt(),
          body(
            'id_subcategoria',
            "O campo 'id_subcategoria' deve ser um número inteiro"
          )
            .optional()
            .isInt(),
          body(
            'data',
            "O campo 'data' deve ser uma data válida no formato 'DD/MM/YYYY'"
          )
            .optional()
            .isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
          body('valor', "O campo 'valor' deve ser um número")
            .optional()
            .isNumeric()
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
