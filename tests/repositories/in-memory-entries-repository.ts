import {
  IEntriesRepository,
  UpdateEntryProps
} from '../../src/application/repositories/entries.repository';
import { GetBalanceByPeriodUseCaseRequest } from '../../src/application/use-cases/balance/get-balance-by-period';
import { EntryEntity } from '../../src/domain/entities/entry';
import Decimal from 'decimal.js';
import { GetEntriesFilter } from '../../src/application/use-cases/entry/types';

export class InMemoryEntriesRepository implements IEntriesRepository {
  public items: EntryEntity[] = [];

  async getEntriesWithFilters(
    filters: GetEntriesFilter
  ): Promise<EntryEntity[]> {
    const filteringFunctions = {
      subCategoryId: (filters: GetEntriesFilter, entry: EntryEntity) =>
        entry.props.subCategoryId === filters.subCategoryId,
      start_date: (filters: GetEntriesFilter, entry: EntryEntity) =>
        (filters.start_date as Date) <= entry.props.date,
      end_date: (filters: GetEntriesFilter, entry: EntryEntity) =>
        (filters.end_date as Date) >= entry.props.date
    };

    return this.items.filter((entry) => {
      const results: boolean[] = [];

      if (filters.subCategoryId)
        results.push(filteringFunctions.subCategoryId(filters, entry));
      if (filters.start_date)
        results.push(filteringFunctions.start_date(filters, entry));
      if (filters.end_date)
        results.push(filteringFunctions.end_date(filters, entry));

      return results.every(Boolean);
    });
  }

  async createEntry({
    value,
    date,
    subCategoryId,
    comment
  }: {
    value: Decimal;
    date: Date;
    subCategoryId: number;
    comment: string;
  }): Promise<EntryEntity> {
    const entryId =
      this.items.length > 0 ? this.items[-1].props.entryId + 1 : 1;

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

  async getAllEntries(): Promise<EntryEntity[]> {
    return this.items;
  }

  async deleteEntryById(entryId: number): Promise<void> {
    this.items = this.items.filter((entry) => entry.props.entryId !== entryId);
  }

  async updateEntryById({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: UpdateEntryProps): Promise<EntryEntity> {
    const entryIndex = this.items.findIndex(
      (entry) => entry.props.entryId === entryId
    );
    const entry = this.items[entryIndex];

    if (value) entry.props.value = value;
    if (date) entry.props.date = date;
    if (subCategoryId) entry.props.subCategoryId = subCategoryId;
    if (comment) entry.props.comment = comment;

    this.items[entryIndex] = entry;

    return entry;
  }

  async findEntriesByPeriod({
    startDate,
    endDate
  }: GetBalanceByPeriodUseCaseRequest): Promise<EntryEntity[]> {
    return this.items.filter((entry) => {
      return entry.props.date >= startDate && entry.props.date <= endDate;
    });
  }

  async findEntriesByPeriodAndSubCategories({
    startDate,
    endDate,
    subCategoriesIds
  }: {
    startDate: Date;
    endDate: Date;
    subCategoriesIds: number[];
  }) {
    return this.items.filter((entry) => {
      return (
        entry.props.date >= startDate &&
        entry.props.date <= endDate &&
        subCategoriesIds.includes(entry.props.subCategoryId)
      );
    });
  }
}
