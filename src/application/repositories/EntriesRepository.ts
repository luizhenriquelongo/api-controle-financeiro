import { EntryEntity, EntryProps } from '../../domain/entities/entry';

export type UpdateEntryProps = {
  entryId: number;
  value?: number;
  date?: Date;
  subCategoryId?: number;
  comment?: string;
};

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

  deleteEntryById(entryId: number): Promise<void>;

  updateEntryById({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: UpdateEntryProps): Promise<EntryEntity>;
}
