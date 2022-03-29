import { IEntriesRepository } from '../../repositories/entries.repository';
import APIException from '../../exceptions/api.exception';

type GetEntryUseCaseRequest = {
  entryId: number;
};

export class GetEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({ entryId }: GetEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      return new APIException(
        404,
        [`Lancamento com id ${entryId} não existe.`],
        'recurso_nao_encontrado'
      );
    }

    return entry;
  }
}
