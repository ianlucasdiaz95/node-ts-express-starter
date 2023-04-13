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
    DB_DATABASE,
    RATE_LIMIT_WINDOW,
    RATE_LIMIT_MAX_REQUESTS,
    TOKEN_SECRET,
    REFRESH_SECRET,
    TOKEN_EXPIRE,
    REFRESH_EXPIRE
} = process.env;
