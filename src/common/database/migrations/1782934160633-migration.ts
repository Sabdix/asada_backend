import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1782934160633 implements MigrationInterface {
  name = 'Migration1782934160633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`stock_request\` (
                \`uuid\` varchar(36) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`date\` date NOT NULL,
                \`recipient_email\` varchar(255) NOT NULL,
                \`cc\` varchar(255) NULL,
                \`subject\` varchar(255) NULL,
                \`uuid_branch\` varchar(255) NULL,
                \`method\` varchar(255) NOT NULL,
                \`status\` varchar(255) NOT NULL DEFAULT 'sent',
                PRIMARY KEY (\`uuid\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
        `);

    await queryRunner.query(`
            CREATE TABLE \`stock_request_detail\` (
                \`uuid\` varchar(36) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`uuid_stock_request\` varchar(255) NOT NULL,
                \`producto\` varchar(255) NOT NULL,
                \`unidad_medida\` varchar(255) NULL,
                \`cantidad_requerida\` varchar(255) NULL,
                \`cantidad_requerida_festivo\` varchar(255) NULL,
                \`fecha\` varchar(255) NULL,
                \`cantidad_actual\` varchar(255) NULL,
                \`cantidad_previa\` varchar(255) NULL,
                \`a_solicitar\` decimal(10,3) NULL,
                \`a_solicitar_festivo\` decimal(10,3) NULL,
                \`revisor\` varchar(255) NULL,
                \`tipo\` varchar(255) NULL,
                \`checklist\` varchar(255) NULL,
                \`entradas\` decimal(10,3) NULL,
                \`diferencia\` varchar(255) NULL,
                \`turno\` varchar(255) NULL,
                PRIMARY KEY (\`uuid\`),
                KEY \`FK_stock_request_detail_request\` (\`uuid_stock_request\`),
                CONSTRAINT \`FK_stock_request_detail_request\` FOREIGN KEY (\`uuid_stock_request\`) REFERENCES \`stock_request\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`stock_request_detail\``);
    await queryRunner.query(`DROP TABLE \`stock_request\``);
  }
}
