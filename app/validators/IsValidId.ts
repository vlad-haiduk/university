import AbstractValidator from "./AbstractValidator";
import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { isValidObjectId } from "mongoose";

/**
 * Class IsValidId
 */
export default class IsValidId extends AbstractValidator
{

    /**
     * @inheritDoc
     */
    public options: {params: Array<string>};

    /**
     * @inheritDoc
     */
    public async validate(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        let errors = [];
        this.options.params.forEach((param: string) => {
            if (!isValidObjectId(req.params[param])) {
                errors.push(param);
            }
        });

        if (errors.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "error",
                message: "Invalid ObjectId",
            });
        } else {
            next();
        }
    }

}