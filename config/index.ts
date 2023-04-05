import { config } from 'dotenv';
config({ path: `.${process.env.NODE_ENV || 'dev'}.env` });

// If .env wasn't provided then exit
if (!process.env.PORT) {
    console.error('==> Please check your .env');
    process.exit(1);
}

export const {
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE
} = process.env;
