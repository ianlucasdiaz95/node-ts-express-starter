import { validate } from "class-validator";
import { RequestHandler } from "express";

export function validateDto(type: any): RequestHandler {
    return async (req: any, res: any, next: any) => {
        const objectToValidate = new type();
        Object.assign(objectToValidate, req.body);

        const errors = await validate(objectToValidate);

        if (errors.length > 0) {
            const firstError = errors[0];
            res.status(400).json({ success: false, error: firstError.constraints });
        } else {
            next();
        }
    };
}