import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class CategoryDBEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;
}
