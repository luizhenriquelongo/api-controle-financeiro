import { EntryEntity, EntryProps } from '../../domain/entities/entry';

export interface IEntriesRepository {
  createEntry({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: EntryProps): Promise<EntryEntity>;

  findEntryById(entryId: number): Promise<EntryEntity | null>;

  getAllEntries(): Promise<EntryEntity[]>;

  deleteById(entryId: number): Promise<void>;
}
