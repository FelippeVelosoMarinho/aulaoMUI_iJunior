// eslint-disable-next-line no-unused-vars
import { PayloadParams } from '../src/domains/users/types/PayloadParams';

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace Express {
        // eslint-disable-next-line no-unused-vars
        interface Request{
            // user?: PayloadParams
            user: any;
        }
    }
// eslint-disable-next-line no-unused-vars
namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface ProcessEnv {
        DB: string;
        DB_NAME: string;
        DB_USERNAME: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_HOST: string;
        SECRET_KEY: string;
        NODE_ENV: string;
        JWT_EXPIRATION: string;
        APP_URL: string;
        EMAIL_HOST: string;
        EMAIL_PORT: string;
        EMAIL_USER: string;
        EMAIL_PASSWORD: string;
        AWS_ACESSS_KEY_ID: string;
        AWS_SECRET_ACESS_KEY_ID: string;
        AWS_DEFAULT_REGION: string;
        AWS_BUCKET_NAME: string;
    }
}
}