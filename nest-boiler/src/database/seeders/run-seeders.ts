import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DatabaseSeeder } from './database.seeder';
import { User } from '../../modules/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

/**
 * Seeder CLI Script
 * 
 * Run with: npm run seed
 * 
 * This creates a temporary NestJS application context to run seeders.
 */
async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get(getRepositoryToken(User));
  const seeder = new DatabaseSeeder(userRepository);

  try {
    await seeder.seed();
    console.log('Seeding completed successfully ✅');
  } catch (error) {
    console.error('Seeding failed ❌', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeders();
