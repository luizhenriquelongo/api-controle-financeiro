import { EntryEntity } from '../../domain/entities/entry';
import { GetBalanceByPeriodUseCaseRequest } from '../use-cases/balance/get-balance-by-period';
import { GetEntriesFilter } from '../use-cases/entry/types';
import { postgresDataSource } from '../../database/data-source';
import { EntryDBEntity } from '../../database/entities/entry.entity';
import Decimal from 'decimal.js';
import {
  Between,
  FindOperator,
  In,
  LessThanOrEqual,
  MoreThanOrEqual
} from 'typeorm';
import APIException from '../exceptions/api.exception';

export type UpdateEntryProps = {
  entryId: number;
  value?: Decimal;
  date?: Date;
  subCategoryId?: number;
  comment?: string;
};

export interface IEntriesRepository {
  createEntry({
    value,
    date,
    subCategoryId,
    comment
  }: {
    value: Decimal;
    date?: Date;
    subCategoryId: number;
    comment?: string;
  }): Promise<EntryEntity>;

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

  findEntriesByPeriod({
    startDate,
    endDate
  }: GetBalanceByPeriodUseCaseRequest): Promise<EntryEntity[]>;

  findEntriesByPeriodAndSubCategories({
    startDate,
    endDate,
    subCategoriesIds
  }: {
    startDate: Date;
    endDate: Date;
    subCategoriesIds: number[];
  }): Promise<EntryEntity[]>;

  getEntriesWithFilters(filters: GetEntriesFilter): Promise<EntryEntity[]>;
}

export class EntriesPostgresRepository implements IEntriesRepository {
  async createEntry({
    value,
    date,
    subCategoryId,
    comment
  }: {
    value: Decimal;
    date?: Date;
    subCategoryId: number;
    comment?: string;
  }): Promise<EntryEntity> {
    const entryData: {
      value: Decimal;
      date?: Date;
      subcategory_id: number;
      comment?: string;
    } = {
      value,
      subcategory_id: subCategoryId
    };

    if (date) entryData.date = date;
    if (comment) entryData.comment = comment;

    const entryEntity = await postgresDataSource
      .getRepository(EntryDBEntity)
      .create(entryData);

    await postgresDataSource.getRepository(EntryDBEntity).save(entryEntity);

    const entry = (await postgresDataSource
      .getRepository(EntryDBEntity)
      .findOneBy({ id: entryEntity.id })) as EntryDBEntity;

    return EntryEntity.create({
      entryId: entry.id,
      subCategoryId: entry.subcategory_id,
      value: entry.value,
      date: entry.date,
      comment: entry.comment
    });
  }

  async deleteEntryById(entryId: number): Promise<void> {
    await postgresDataSource.getRepository(EntryDBEntity).delete(entryId);
  }

  async findEntriesByPeriod({
    startDate,
    endDate
  }: GetBalanceByPeriodUseCaseRequest): Promise<EntryEntity[]> {
    const entries = await postgresDataSource
      .getRepository(EntryDBEntity)
      .findBy({ date: Between(startDate, endDate) });

    return entries.map((entry) =>
      EntryEntity.create({
        entryId: entry.id,
        subCategoryId: entry.subcategory_id,
        value: entry.value,
        date: entry.date,
        comment: entry.comment
      })
    );
  }

  async findEntriesByPeriodAndSubCategories({
    startDate,
    endDate,
    subCategoriesIds
  }: {
    startDate: Date;
    endDate: Date;
    subCategoriesIds: number[];
  }): Promise<EntryEntity[]> {
    const entries = await postgresDataSource
      .getRepository(EntryDBEntity)
      .findBy({
        date: Between(startDate, endDate),
        subcategory_id: In(subCategoriesIds)
      });

    return entries.map((entry) =>
      EntryEntity.create({
        entryId: entry.id,
        subCategoryId: entry.subcategory_id,
        value: entry.value,
        date: entry.date,
        comment: entry.comment
      })
    );
  }

  async findEntryById(entryId: number): Promise<EntryEntity | null> {
    const entry = await postgresDataSource
      .getRepository(EntryDBEntity)
      .findOneBy({ id: entryId });

    if (!entry) return null;

    return EntryEntity.create({
      entryId: entry.id,
      subCategoryId: entry.subcategory_id,
      value: entry.value,
      date: entry.date,
      comment: entry.comment
    });
  }

  async getAllEntries(): Promise<EntryEntity[]> {
    const entries = await postgresDataSource
      .getRepository(EntryDBEntity)
      .find();

    return entries.map((entry) =>
      EntryEntity.create({
        entryId: entry.id,
        subCategoryId: entry.subcategory_id,
        value: entry.value,
        date: entry.date,
        comment: entry.comment
      })
    );
  }

  async getEntriesWithFilters(
    filters: GetEntriesFilter
  ): Promise<EntryEntity[]> {
    const where: { date?: FindOperator<any>; subcategory_id?: number } = {};
    if (filters.start_date && filters.end_date)
      where.date = Between(filters.start_date, filters.end_date);
    if (filters.start_date && !filters.end_date)
      where.date = MoreThanOrEqual(filters.start_date);
    if (!filters.start_date && filters.end_date)
      where.date = LessThanOrEqual(filters.end_date);
    if (filters.subCategoryId) where.subcategory_id = filters.subCategoryId;

    const entries = await postgresDataSource
      .getRepository(EntryDBEntity)
      .findBy(where);

    return entries.map((entry) =>
      EntryEntity.create({
        entryId: entry.id,
        subCategoryId: entry.subcategory_id,
        value: entry.value,
        date: entry.date,
        comment: entry.comment
      })
    );
  }

  async updateEntryById({
    entryId,
    value,
    date,
    subCategoryId,
    comment
  }: UpdateEntryProps): Promise<EntryEntity> {
    const entry = (await postgresDataSource
      .getRepository(EntryDBEntity)
      .findOneBy({ id: entryId })) as EntryDBEntity;

    const toUpdate: {
      value?: Decimal;
      date?: Date;
      subcategory_id?: number;
      comment?: string;
    } = {};
    if (value) toUpdate.value = value;
    if (date) toUpdate.date = date;
    if (comment) toUpdate.comment = comment;
    if (subCategoryId) toUpdate.subcategory_id = subCategoryId;

    postgresDataSource.getRepository(EntryDBEntity).merge(entry, toUpdate);
    const result = await postgresDataSource
      .getRepository(EntryDBEntity)
      .save(entry);

    return EntryEntity.create({
      entryId: result.id,
      subCategoryId: result.subcategory_id,
      value: result.value,
      date: result.date,
      comment: result.comment
    });
  }
}
