import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1791158400000 implements MigrationInterface {
  name = 'Migration1791158400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`folders\` (
                \`uuid\` varchar(36) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`parent_id\` varchar(36) NULL,
                \`created_by\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_folders_parent_id_name\` (\`parent_id\`, \`name\`),
                PRIMARY KEY (\`uuid\`),
                CONSTRAINT \`FK_folders_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\` (\`uuid\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

    await queryRunner.query(`
            CREATE TABLE \`documents\` (
                \`uuid\` varchar(36) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`original_name\` varchar(255) NOT NULL,
                \`stored_filename\` varchar(255) NOT NULL,
                \`mime_type\` varchar(150) NOT NULL,
                \`size\` bigint NOT NULL,
                \`folder_id\` varchar(36) NULL,
                \`metadata\` json NULL,
                \`uploaded_by\` varchar(255) NULL,
                INDEX \`IDX_documents_original_name\` (\`original_name\`),
                INDEX \`IDX_documents_folder_id_original_name\` (\`folder_id\`, \`original_name\`),
                PRIMARY KEY (\`uuid\`),
                CONSTRAINT \`FK_documents_folder\` FOREIGN KEY (\`folder_id\`) REFERENCES \`folders\` (\`uuid\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`documents\``);
    await queryRunner.query(`DROP TABLE \`folders\``);
  }
}
