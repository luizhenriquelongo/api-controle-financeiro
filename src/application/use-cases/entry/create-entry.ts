import { IEntriesRepository } from '../../repositories/EntriesRepository';

type CreateEntryUseCaseRequest = {
  entryId: number;
  value: number;
  date: Date;
  subCategoryId: number;
  comment: string;
};

export class CreateEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: CreateEntryUseCaseRequest) {
    const entry = await this.entriesRepository.createEntry({
      entryId,
      value,
      date,
      subCategoryId,
      comment
    });

    return entry;
  }
}
