import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './client.js';
import { connectDB, closeDB } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    await connectDB();
    console.log('Running migrations...');

    // Run migrations
    await migrate(db, {
      migrationsFolder: path.join(__dirname, '../../migrations'),
    });

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

runMigrations();
