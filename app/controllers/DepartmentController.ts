import { AbstractController } from "./AbstractController";
import HttpMethods from "http-methods-constants";
import { NextFunction, Request, Response } from "express";
import JsonSchema from "../validators/JsonSchema";
import { StatusCodes } from "http-status-codes";
import Department from "../models/Department";
import Lector from "../models/Lector";
import { isValidObjectId, ObjectId } from "mongoose";

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
        if (isValidObjectId(req.body.head)) {
            const record = await Lector.model.findById(req.body.head).lean();
            if (record) {
                const lector = await Lector.model.create({
                    name: req.body.name,
                    head: req.body.head
                });

                lector;
            } else {
                super.sendError(res, StatusCodes.NOT_FOUND, `Lector not found with id ${req.body.head}`);
            }
        } else {
            super.sendError(res, StatusCodes.BAD_REQUEST, "Invalid lector id");
        }
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