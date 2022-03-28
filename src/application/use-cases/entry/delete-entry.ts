import { IEntriesRepository } from '../../repositories/entries.repository';

type DeleteEntryUseCaseRequest = {
  entryId: number;
};

export class DeleteEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({ entryId }: DeleteEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      throw new Error("Can't delete entry because entry do not exists.");
    }

    await this.entriesRepository.deleteEntryById(entryId);
  }
}
