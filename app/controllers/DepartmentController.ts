import { AbstractController } from "./AbstractController";
import HttpMethods from "http-methods-constants";
import { NextFunction, Request, Response } from "express";
import JsonSchema from "../validators/JsonSchema";
import { StatusCodes } from "http-status-codes";
import Department from "../models/Department";
import Lector from "../models/Lector";
import { isValidObjectId, ObjectId } from "mongoose";
import IsValidId from "../validators/IsValidId";

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
        },
        {
            path: "/count",
            method: HttpMethods.GET,
            middleware: this.count,
            validators: []
        },
        {
            path: "/find",
            method: HttpMethods.GET,
            middleware: this.find,
            validators: []
        },
        {
            path: "/:id",
            method: HttpMethods.GET,
            middleware: this.getOne,
            validators: [
                new IsValidId({params: ["id"]})
            ]
        },
    ];

    /**
     * @param req
     * @param res
     * @param next
     */
    public async create(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const document = await Department.model.findOne({name: req.body.name});
        if (!document) {
            if (isValidObjectId(req.body.head)) {
                const record = await Lector.model.findById(req.body.head);
                if (record) {
                    const department = await Department.model.create({
                        name: req.body.name,
                        head: req.body.head
                    });

                    this.sendSuccess(res, department.toJSON());
                } else {
                    super.sendError(res, StatusCodes.NOT_FOUND, `Lector not found with id ${req.body.head}`);
                }
            } else {
                super.sendError(res, StatusCodes.BAD_REQUEST, "Invalid lector id");
            }
        } else {
            super.sendError(res, StatusCodes.CONFLICT, `Department is already exist with name ${req.body.name}`);
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async listData(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const departments = [];

        for await (const department of Department.model.find()) {
            departments.push(department.toJSON());
        }

        super.sendSuccess(res, departments);
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async getOne(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const document = await Department.model.findById(req.params.id);
        if (!document) {
            this.sendError(res, StatusCodes.NOT_FOUND, "Department not found");
        } else {
            super.sendSuccess(res, document.toJSON());
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async count(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const count = await Department.model.count();

        super.sendSuccess(res, {count: count});
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async find(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        if (req.query.name) {
            const document: any = await Department.model.findOne({name: req.query.name});
            if (document) {
                super.sendSuccess(res, [document.toJSON()]);
            } else {
                super.sendSuccess(res, []);
            }

        } else {
            super.sendError(res, StatusCodes.BAD_REQUEST, 'Invalid query param');
        }
    }

}