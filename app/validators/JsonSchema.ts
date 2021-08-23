import AbstractValidator from "./AbstractValidator";
import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { Validator } from "jsonschema";

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
     * @inheritDoc
     */
    public async validate(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        let errors: Array<{field: string, error: string}> = [];
        this.options.schema.forEach((field: {fieldName: string, fieldType: string}, key: number) => {
            if (req.body[field.fieldName]) {
                const result = new Validator().validate(req.body[field.fieldName], {type: field.fieldType});
                if (!result.valid) {
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