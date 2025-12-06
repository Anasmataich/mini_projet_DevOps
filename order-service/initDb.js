import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const queries = schema.split(';').filter(query => query.trim() !== '');

        console.log('🔄 Initializing database...');

        for (const query of queries) {
            await pool.query(query);
        }

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
};

export default initDb;
