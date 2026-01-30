import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial Migration - Create Users Table
 * 
 * This migration creates the users table with all necessary fields.
 * 
 * TypeORM Migration Commands:
 * - Generate: npm run migration:generate -- src/database/migrations/MigrationName
 * - Create: npm run migration:create -- src/database/migrations/MigrationName
 * - Run: npm run migration:run
 * - Revert: npm run migration:revert
 * 
 * Best Practices:
 * - Never modify existing migrations (create new ones instead)
 * - Always provide both up() and down() methods
 * - Test migrations on development database first
 * - Keep migrations atomic (one logical change per migration)
 */
export class CreateUsersTable1706600000000 implements MigrationInterface {
  name = 'CreateUsersTable1706600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create index on email for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // Create index on role for filtering
    await queryRunner.query(`
      CREATE INDEX "IDX_users_role" ON "users" ("role")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_users_role"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
