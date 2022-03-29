import { IEntriesRepository } from '../../repositories/entries.repository';
import Decimal from 'decimal.js';
import APIException from '../../exceptions/api.exception';
import { ISubCategoriesRepository } from '../../repositories/sub-categories.repository';

export type UpdateEntryUseCaseRequest = {
  entryId: number;
  value?: Decimal;
  date?: Date;
  subCategoryId?: number;
  comment?: string;
};

export class UpdateEntryUseCase {
  constructor(
    private entriesRepository: IEntriesRepository,
    private subCategoriesRepository: ISubCategoriesRepository
  ) {}
  async execute({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: UpdateEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      return new APIException(
        404,
        [`Lancamento com id ${entryId} não existe.`],
        'recurso_nao_encontrado'
      );
    }

    if (subCategoryId) {
      const subCategory =
        await this.subCategoriesRepository.findSubCategoryById(subCategoryId);

      if (!subCategory) {
        return new APIException(
          404,
          [
            `Não foi possível editar lancamento: sub categoria com id ${subCategoryId} não existe.`
          ],
          'recurso_nao_encontrado'
        );
      }
    }

    return await this.entriesRepository.updateEntryById({
      entryId: entry.props.entryId,
      value,
      date,
      subCategoryId,
      comment
    });
  }
}
