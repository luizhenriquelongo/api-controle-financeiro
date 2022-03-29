import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEntriesTable1648517992244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'entries',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'value',
            type: 'varchar'
          },
          {
            name: 'subcategory_id',
            type: 'integer'
          },
          {
            name: 'date',
            type: 'date',
            default: 'now()'
          },
          {
            name: 'comment',
            type: 'varchar(255)',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            name: 'fk_entry_subcategory',
            columnNames: ['subcategory_id'],
            referencedTableName: 'subcategories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('entries');
  }
}
