import { EntryEntity } from '../../domain/entities/entry';

type CreateEntryUseCaseRequest = {
  entryId: number;
  value: number;
  date: Date;
  subCategoryId: number;
  comment: string;
};

export class CreateEntryUseCase {
  async execute({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: CreateEntryUseCaseRequest) {
    const entry = EntryEntity.create({
      entryId,
      value,
      date,
      subCategoryId,
      comment
    });

    return entry;
  }
}
