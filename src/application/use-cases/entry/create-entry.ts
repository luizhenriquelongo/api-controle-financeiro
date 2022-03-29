import { IEntriesRepository } from '../../repositories/entries.repository';
import Decimal from 'decimal.js';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';
import APIException from '../../exceptions/api.exception';

export type CreateEntryUseCaseRequest = {
  value: Decimal;
  date?: Date;
  subCategoryId: number;
  comment?: string;
};

export class CreateEntryUseCase {
  constructor(
    private entriesRepository: IEntriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({
    value,
    date,
    subCategoryId,
    comment
  }: CreateEntryUseCaseRequest) {
    const subCategory = await this.subCategoriesRepository.findSubCategoryById(
      subCategoryId
    );

    if (!subCategory) {
      return new APIException(
        404,
        [
          `Não foi possível criar lancamento: sub categoria com id ${subCategoryId} não existe.`
        ],
        'recurso_nao_encontrado'
      );
    }

    const entry = await this.entriesRepository.createEntry({
      value,
      date,
      subCategoryId,
      comment
    });

    return entry;
  }
}
