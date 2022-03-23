import { IEntriesRepository } from '../../repositories/EntriesRepository';

type GetEntryUseCaseRequest = {
  entryId: number;
};

export class GetEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({ entryId }: GetEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      throw new Error('Entry not found.');
    }

    return entry;
  }
}
