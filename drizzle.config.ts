import type {Config} from 'drizzle-kit';
import * as dotenv from 'dotenv';

// In the tsconfig.json we need to update the target to es6.

dotenv.config(
    { path: '.env'}
);

export default {
    driver: 'pg',
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
} satisfies Config;

// We need to install the package dotenv to read the environment variables from the .env file.

// After setting it all we neet to push the schema using bunx drizzle-kit push:pg

// To run studio: bunx drizzle-kit studio