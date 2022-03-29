import { IEntriesRepository } from '../../repositories/entries.repository';
import APIException from '../../exceptions/api.exception';

type DeleteEntryUseCaseRequest = {
  entryId: number;
};

export class DeleteEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({ entryId }: DeleteEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      return new APIException(
        404,
        [`Lancamento com id ${entryId} não existe.`],
        'recurso_nao_encontrado'
      );
    }

    await this.entriesRepository.deleteEntryById(entryId);
    return null;
  }
}
