import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSubCategoriesTable1648481235297
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subcategories',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar(200)'
          },
          {
            name: 'category_id',
            type: 'integer'
          }
        ],
        foreignKeys: [
          {
            name: 'fk_subcategory_category',
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subcategories');
  }
}
