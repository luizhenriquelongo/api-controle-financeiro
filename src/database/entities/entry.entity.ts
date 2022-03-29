// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { DecimalToString, DecimalTransformer } from '../decimal.transformers';
import Decimal from 'decimal.js';
import { Transform } from 'class-transformer';
import { SubCategoryDBEntity } from './sub-category.entity';

@Entity('entries')
export class EntryDBEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'value',
    type: 'decimal',
    precision: 20,
    scale: 2,
    transformer: new DecimalTransformer()
  })
  @Transform(DecimalToString(), { toPlainOnly: true })
  value: Decimal;

  @Column()
  subcategory_id: number;

  @ManyToOne(() => SubCategoryDBEntity)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubCategoryDBEntity;

  @Column()
  date: Date;

  @Column({ nullable: true })
  comment: string;
}
