const morgan = require('morgan');
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import morgan from 'morgan'
import { Service } from 'typedi';


// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream = {
    // Use the http severity
    write: (message) => console.log(message),//logger.http(message)
};

// Skip all the Morgan http log if the 
// application is not running in development mode.
// This method is not really needed here since 
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = (req, res) => {
    if (req.originalUrl === '/') {
        return true;
    }
    return false;
};

@Middleware({ type: 'before' })
@Service()
export class MorganMiddleware implements ExpressMiddlewareInterface {
    // interface implementation is optional

    use(request: any, response: any, next?: (err?: any) => any): any {
        morgan(
            // Define message format string (this is the default one).
            // The message format is made from tokens, and each token is
            // defined inside the Morgan library.
            // You can create your custom token to show what do you want from a request.
            ":method :url :status :res[content-length] - :response-time ms",
            // Options: in this case, I overwrote the stream and the skip logic.
            // See the methods above.
            { stream: stream, flags: 'a', skip: skip }
        )(request, response, next);
    }
}