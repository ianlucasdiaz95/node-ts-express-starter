import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';
import logger from '@/log/logger';

interface IErrorResponse extends Error {
    success: false;
    name: string;
    httpCode: number;
    message: string | undefined;
    errors: string[] | undefined;
}

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: Request, response: Response, next: (err?: any) => any) {

        const responseObject: IErrorResponse = {
            success: false,
            name: 'Internal Server Error',
            httpCode: 500,
            message: error.message,
            errors: undefined,
        };

        //Check for class-validator errors
        if (Array.isArray(error.errors) && error.errors.every(element => element instanceof ValidationError)){
            
            responseObject.name = error.name;
            responseObject.httpCode = error.httpCode;
            responseObject.message = error.message;
            responseObject.errors = [];

            error.errors.forEach((element: ValidationError) => {
                const constraints = element.constraints || Object;
                Object.keys(constraints).forEach(type => {
                    responseObject.errors?.push(`Property ${constraints[type]}`);
                });
            });

            response.status(error.httpCode).json(responseObject);

        //If not class-validator, handle normal error
        } else if (error instanceof HttpError) {
            
            responseObject.name = error.name;
            responseObject.httpCode = error.httpCode;

            response.status(error.httpCode).json(error);

        }else{

            logger.error('ERROR: ' + error.message + ' @ ' + error.stack );

            responseObject.message = error.message;

            response.status(500).json(responseObject)
        }

        next(error);
    }
}