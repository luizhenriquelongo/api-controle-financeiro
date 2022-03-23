import { IEntriesRepository } from '../../src/application/repositories/EntriesRepository';
import { EntryProps, EntryEntity } from '../../src/domain/entities/entry';

export class InMemoryEntriesRepository implements IEntriesRepository {
  public items: EntryEntity[] = [];

  async createEntry({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: EntryProps): Promise<EntryEntity> {
    const entry = EntryEntity.create({
      entryId,
      value,
      date,
      subCategoryId,
      comment
    });
    this.items.push(entry);

    return entry;
  }

  async findEntryById(entryId: number): Promise<EntryEntity | null> {
    const entry = this.items.find((entry) => entry.props.entryId === entryId);

    if (!entry) return null;

    return entry;
  }
}
