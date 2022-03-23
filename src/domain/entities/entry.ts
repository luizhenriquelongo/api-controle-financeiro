import { Entity } from '../../core/domain/Entity';

type EntryProps = {
  entryId: number;
  value: number;
  date: string;
  subCategoryId: number;
  comment: string;
};

export class EntryEntity extends Entity<EntryProps> {
  private constructor(props: EntryProps) {
    super(props);
  }

  static create(props: EntryProps) {
    const entry = new EntryEntity(props);

    return entry;
  }
}