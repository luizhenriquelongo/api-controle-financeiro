import { IEntriesRepository } from '../../repositories/EntriesRepository';

type UpdateEntryUseCaseRequest = {
  entryId: number;
  value?: number;
  date?: Date;
  subCategoryId?: number;
  comment?: string;
};

export class UpdateEntryUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: UpdateEntryUseCaseRequest) {
    const entry = await this.entriesRepository.findEntryById(entryId);

    if (!entry) {
      throw new Error("Can't update entry because entry do not exists.");
    }

    const updatedEntry = await this.entriesRepository.updateEntryById({
      entryId: entry.props.entryId,
      value,
      date,
      subCategoryId,
      comment
    });

    return updatedEntry;
  }
}
