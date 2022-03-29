import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { CategoryDBEntity } from './category.entity';

@Entity('subcategories')
export class SubCategoryDBEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column()
  category_id!: number;

  @ManyToOne(() => CategoryDBEntity)
  @JoinColumn({ name: 'category_id' })
  category!: CategoryDBEntity;
}
