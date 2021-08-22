import { AbstractController } from "./AbstractController";
import HttpMethods from "http-methods-constants";
import JsonSchema from "../validators/JsonSchema";
import { NextFunction, Request, Response } from "express";
import Lector from "../models/Lector";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import Department from "../models/Department";
import IsValidId from "../validators/IsValidId";

/**
 * Class LectorController
 */
export default class LectorController extends AbstractController
{

    /**
     * @inheritDoc
     */
    public entity: string = "lector";

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
                            fieldName: "email",
                            fieldType: "string"
                        },
                        {
                            fieldName: "salary",
                            fieldType: "number"
                        },
                        {
                            fieldName: "degree",
                            fieldType: "string"
                        },
                    ]
                }),
            ]
        },
        {
            path: "/:id/update_membership",
            method: HttpMethods.POST,
            middleware: this.updateMembership,
            validators: [
                new IsValidId({params: ["id"]}),
                new JsonSchema({
                    schema: [
                        {
                            fieldName: "department_ids",
                            fieldType: "array"
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
        const document = await Lector.model.findOne({email: req.body.email});
        if (!document) {
            if (Lector.degrees.includes(req.body.degree)) {
                const lector = await Lector.model.create({
                    name: req.body.name,
                    email: req.body.email,
                    salary: req.body.salary,
                    degree: req.body.degree,
                });

                super.sendSuccess(res, lector.toJSON());
            } else {
                super.sendError(res, StatusCodes.BAD_REQUEST, 'Invalid value for field degree');
            }
        } else {
            super.sendError(res, StatusCodes.CONFLICT, `Lector is already exist with email ${req.body.email}`);
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async updateMembership(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const lector = await Lector.model.findById(req.params.id);
        if (lector) {
            let errors = [];
            for (const department of req.body.department_ids) {
                if (isValidObjectId(department)) {
                    const result = await Department.model.findById(department);
                    if (!result) {
                        errors.push({field: "department_ids", error: `Not found Department with id: ${department}`});
                    }
                } else {
                    errors.push({field: "department_ids", error: `Invalid department id: ${department}`});
                }
            }

            if (errors.length === 0) {
                lector.toJSON()
                const result: any = await Lector.model.findByIdAndUpdate(req.params.id, {departments: req.body.department_ids}, {new: true});

                super.sendSuccess(res, result.toJSON());
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    errors: errors
                });
            }
        } else {
            super.sendError(res, StatusCodes.NOT_FOUND, `Not found Lector with id ${req.params.id}`);
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async listData(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const lectors = [];

        for await (const lector of Lector.model.find()) {
            lectors.push(lector.toJSON());
        }

        super.sendSuccess(res, lectors);
    }

    /**
     * @param req
     * @param res
     * @param next
     */
    public async getOne(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const document = await Lector.model.findById(req.params.id);
        if (!document) {
            this.sendError(res, StatusCodes.NOT_FOUND, "Lector not found");
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
        const count = await Lector.model.count();

        super.sendSuccess(res, {count: count});
    }

}