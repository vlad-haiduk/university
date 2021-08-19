import {AbstractController} from "./AbstractController";
import HttpMethods from "http-methods-constants";
import {NextFunction, Request, Response} from "express";
import JsonSchema from "../validators/JsonSchema";
import {StatusCodes} from "http-status-codes";

/**
 * Class DepartmentController
 */
export default class DepartmentController extends AbstractController
{

    /**
     * @inheritDoc
     */
    public entity: string = "department";

    /**
     * @inheritDoc
     */
    protected routes = [
        {
            path: "/new",
            method: HttpMethods.POST,
            middleware: this.create,
            validators: [
                new JsonSchema({
                    schema: [
                        {
                            fieldName: "name",
                            fieldType: "string"
                        },
                        {
                            fieldName: "head",
                            fieldType: "string"
                        },
                    ]
                }),
            ]
        },
        {
            path: "/list",
            method: HttpMethods.GET,
            middleware: this.listData,
            validators: []
        }
    ];

    /**
     * @param req
     * @param res
     * @param next
     */
    public async create(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        super.sendSuccess(res, "test");
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async listData(req: Request, res: Response, next: NextFunction): Promise<void>
    {
    }

}