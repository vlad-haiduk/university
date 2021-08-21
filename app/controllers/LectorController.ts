import { AbstractController } from "./AbstractController";
import HttpMethods from "http-methods-constants";
import JsonSchema from "../validators/JsonSchema";
import { NextFunction, Request, Response } from "express";
import Lector from "../models/Lector";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import Department from "../models/Department";

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
            path: "/department_membership",
            method: HttpMethods.POST,
            middleware: this.updateMembership,
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
            validators: []
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
        if (req.body.departments && Array.isArray(req.body.departments)) {
            const result = req.body.departments.every((id: any) => {
                if (isValidObjectId(id)) {
                    const department: any = Department.model.findById(id).lean();

                    return !!department;
                }

                return false;
            });
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
        if (isValidObjectId(req.params.id)) {
            const document = await Lector.model.findById(req.params.id);
            if (!document) {
                this.sendError(res, StatusCodes.NOT_FOUND, "Lector not found");
            } else {
                super.sendSuccess(res, document.toJSON());
            }
        } else {
            this.sendError(res, StatusCodes.BAD_REQUEST, "Invalid id");
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