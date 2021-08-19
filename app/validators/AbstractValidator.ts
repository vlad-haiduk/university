import {NextFunction, Request, Response} from "express";

/**
 * Class AbstractValidator
 */
export default abstract class AbstractValidator
{

    /**
     * Validator options
     */
    public options: any;

    /**
     * Entity path
     */
    public entity: string;

    /**
     * @param options
     */
    constructor(options: any)
    {
        this.options  = options;
        this.validate = this.validate.bind(this);
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public abstract validate(req: Request, res: Response, next: NextFunction): Promise<void>;

}