import AbstractValidator from "./AbstractValidator";
import {NextFunction, Request, Response} from "express";
import StatusCodes from "http-status-codes";

/**
 * Class JsonSchema
 */
export default class JsonSchema extends AbstractValidator
{

    /**
     * @inheritDoc
     */
    public options: {schema: Array<{fieldName: string, fieldType: string}>};

    /**
     * Validate json schema
     * @param req
     * @param res
     * @param next
     */
    public async validate(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        let errors: Array<{field: string, error: string}> = [];
        this.options.schema.forEach((field: {fieldName: string, fieldType: string}, key: number) => {
            if (req.body[field.fieldName]) {
                if (typeof req.body[field.fieldName] !== field.fieldType) {
                    errors.push({field: field.fieldName, error: `Field ${field.fieldName} must be a ${field.fieldType} type`});
                }
            } else {
                errors.push({field: field.fieldName, error: `Field ${field.fieldName} not found`});
            }
        });

        if (errors.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "error",
                message: "Invalid json",
                errors: errors
            });
        } else {
            next();
        }
    }

}