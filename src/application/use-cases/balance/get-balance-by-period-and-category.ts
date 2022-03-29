import { IEntriesRepository } from '../../repositories/entries.repository';
import { BalanceEntity } from '../../../domain/entities/balance';
import { ICategoriesRepository } from '../../repositories/categories.repository';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import Decimal from 'decimal.js';
import APIException from '../../exceptions/api.exception';

export type GetBalanceByPeriodAndCategoryUseCaseRequest = {
  startDate: Date;
  endDate: Date;
  categoryId: number;
};

export class GetBalanceByPeriodAndCategoryUseCase {
  constructor(
    private entriesRepository: IEntriesRepository,
    private categoriesRepository: ICategoriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({
    startDate,
    endDate,
    categoryId
  }: GetBalanceByPeriodAndCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findCategoryById(
      categoryId
    );
    if (!category)
      return new APIException(
        404,
        [
          `Não foi possível pegar o balanco: categoria com id ${categoryId} não existe.`
        ],
        'recurso_nao_encontrado'
      );

    const subCategories =
      await this.subCategoriesRepository.getAllSubCategoriesByCategoryId(
        categoryId
      );
    const subCategoriesIds = subCategories.map(
      (subCategory) => subCategory.props.subCategoryId
    );

    const entries =
      await this.entriesRepository.findEntriesByPeriodAndSubCategories({
        startDate,
        endDate,
        subCategoriesIds
      });

    const income = entries.reduce((partialSum, entity) => {
      if (entity.props.value.toNumber() > 0)
        return partialSum + entity.props.value.toNumber();
      return partialSum;
    }, 0);
    const expense = entries.reduce((partialSum, entity) => {
      if (entity.props.value.toNumber() < 0)
        return partialSum + entity.props.value.toNumber();
      return partialSum;
    }, 0);
    const balanceSum = entries.reduce(
      (partialSum, entity) => partialSum + entity.props.value.toNumber(),
      0
    );

    return BalanceEntity.create({
      category: {
        categoryId: category.props.categoryId,
        name: category.props.name
      },
      income: new Decimal(income),
      expense: new Decimal(expense),
      balance: new Decimal(balanceSum)
    });
  }
}
