import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772549000898 implements MigrationInterface {
    name = 'Migration1772549000898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`check_list_group\` (\`uuid\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`check_list_group_check_list\` (\`uuid\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`uuid_check_list_group\` varchar(255) NOT NULL, \`uuid_check_list\` varchar(255) NOT NULL, \`priority\` int NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`check_list_group_check_list\` ADD CONSTRAINT \`FK_1c1843e26dfcc64ed2402cb2ce1\` FOREIGN KEY (\`uuid_check_list_group\`) REFERENCES \`check_list_group\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`check_list_group_check_list\` ADD CONSTRAINT \`FK_ccb5e520575261400dffda47c2e\` FOREIGN KEY (\`uuid_check_list\`) REFERENCES \`check_list\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`check_list_group_check_list\` DROP FOREIGN KEY \`FK_ccb5e520575261400dffda47c2e\``);
        await queryRunner.query(`ALTER TABLE \`check_list_group_check_list\` DROP FOREIGN KEY \`FK_1c1843e26dfcc64ed2402cb2ce1\``);
       
        await queryRunner.query(`DROP TABLE \`check_list_group_check_list\``);
        await queryRunner.query(`DROP TABLE \`check_list_group\``);
    }

}
