import { NextFunction, Request, Response, Router } from "express";
import { TRoute } from "../types/TRoute";
import StatusCodes from "http-status-codes";
import HttpMethods from "http-methods-constants";

/**
 * Class AbstractController
 */
export abstract class AbstractController
{

    /**
     * Variable of express Router
     */
    public ExpressRouter: Router = Router();

    /**
     * Entity routes
     * @protected
     */
    protected abstract routes: Array<TRoute> = [];

    /**
     * Entity path
     */
    public abstract entity: string;

    /**
     * Routes handling & initialization
     */
    public initRoutes(): Router
    {
        // 405 & 404 errors for entity-path handling
        this.ExpressRouter.use((req: Request, res: Response, next: NextFunction) => {
            const paths = this.routes.map((r: TRoute) => r.path);
            if (paths.includes(req.path)) {
                const methods = this.routes.filter((r: TRoute) => r.path === req.path).map((r: TRoute) => r.method);
                if (methods.includes(req.method)) {
                    next();
                } else {
                    this.sendError(res, StatusCodes.METHOD_NOT_ALLOWED, `Method not allowed for path ${req.path}`);
                }
            } else {
                const routes = this.routes.filter((r: TRoute) => r.path.match(/\/\:/) !== null);
                if (routes !== null) {
                    const methods = routes.map((r: TRoute) => r.method);
                    if (methods.includes(req.method)) {
                        next();
                    } else {
                        this.sendError(res, StatusCodes.METHOD_NOT_ALLOWED, `Method not allowed for ${this.entity} record`);
                    }
                } else {
                    this.sendError(res, StatusCodes.NOT_FOUND, `Path ${req.path} not found`);
                }
            }
        });

        for (const route of this.routes) {
            for (const validator of route.validators) {
                validator.instance.options = validator.options;
                validator.instance.entity  = this.entity;

                this.ExpressRouter.use(route.path, validator.instance.validate);
            }

            const middleware = route.middleware.bind(this);
            switch (route.method) {
                case HttpMethods.GET:
                    this.ExpressRouter.get(route.path, middleware);
                    break;
                case HttpMethods.POST:
                    this.ExpressRouter.post(route.path, middleware);
                    break;
                case HttpMethods.PUT:
                    this.ExpressRouter.put(route.path, middleware);
                    break;
                case HttpMethods.PATCH:
                    this.ExpressRouter.patch(route.path, middleware);
                    break;
                case HttpMethods.DELETE:
                    this.ExpressRouter.delete(route.path, middleware);
                    break;
                default:
                    throw new Error("A not valid method");
            }
        }

        return this.ExpressRouter;
    }

    /**
     * Generate success response
     * @param res
     * @param code
     * @param data
     */
    public sendSuccess(res: Response, data: any, code = StatusCodes.OK): Response
    {
        return res.status(code).json({
            status: "success",
            data: data
        });
    }

    /**
     * Generate error response
     * @param res
     * @param errorCode
     * @param errorMessage
     */
    public sendError(res: Response, errorCode: number, errorMessage: string): Response
    {
        return res.status(errorCode).json({
            status: "error",
            message: errorMessage
        });
    }

}