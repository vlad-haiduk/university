import { Response, Request, NextFunction } from 'express';
import AbstractValidator from "../validators/AbstractValidator"

/**
 * Route type
 */
export type TRoute = {

    /**
     * Route path
     */
    path: string;

    /**
     * Route method
     */
    method: string;

    /**
     * Route middleware
     * @param req
     * @param res
     * @param next
     */
    middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

    /**
     * Route validators
     */
    validators: Array<{instance: AbstractValidator, options?: object}>;

}