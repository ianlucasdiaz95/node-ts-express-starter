import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import rateLimit from 'express-rate-limit';
import { Service } from 'typedi';

import {
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW
} from '../config';

const rateLimiter = rateLimit({
    windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '5') * 60 * 1000,
    max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100'),
    headers: true,
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

@Middleware({ type: 'before' })
@Service()
export class RateMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any): any {
        rateLimiter(request, response, next);
    }
}
