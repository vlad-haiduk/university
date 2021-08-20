import express, { Application, NextFunction, Request, Response } from "express";
import { AbstractController } from "./controllers/AbstractController";
import mongoose from "mongoose";
import StatusCodes from "http-status-codes";

/**
 * class App
 */
export class App
{

    /**
     * Application variable
     */
    public application: Application;

    /**
     * Application port
     * @private
     */
    private _port: number;

    /**
     * Create App
     * @param appInit
     */
    constructor(appInit: {port: number, middlewares: Array<any>, controllers: Array<AbstractController>})
    {
        this.port = appInit.port;

        this.application = express();

        this.initMiddlewares(appInit.middlewares);
        this.initControllers(appInit.controllers);
    }

    /**
     * Set application port
     * @param value
     */
    set port(value: number)
    {
        if (value >= 0) {
            this._port = value;
        } else {
            throw new Error(`Port ${value} is invalid`);
        }
    }

    /**
     * Get application port
     * @returns {number} port
     */
    get port(): number
    {
        return this._port;
    }

    /**
     * Registering middleware
     * @param middlewares
     * @private
     */
    private initMiddlewares(middlewares: Array<any>): void
    {
        middlewares.forEach((middleware) => {
            this.application.use(middleware);
        });
    }

    /**
     * Controllers register
     * @param controllers
     * @private
     */
    private initControllers(controllers: Array<AbstractController>): void
    {
        controllers.forEach(controller => {
            this.application.use(`/${controller.entity}`, controller.initRoutes());
        });

        // Global handling of 404 response
        this.application.use((req: Request, res: Response) => {
            res.status(StatusCodes.NOT_FOUND).json('Resource not found');
        });

        // Global json parser
        this.application.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof SyntaxError) {
                res.status(StatusCodes.BAD_REQUEST).json('Invalid json');
            } else {
                next();
            }
        });
    }

    /**
     * Init db connection
     * @param uri
     * @param options
     */
    public async initDatabase(uri: string, options: mongoose.ConnectionOptions): Promise<void>
    {
        try {
            await mongoose.connect(uri, options);
        } catch (error: any) {
            console.log(error);
        }
    }

    /**
     * Bootstrap server
     */
    public async bootstrap(): Promise<any>
    {
        const server = this.application.listen(this.port, () => {
            console.log(`App started on port ${this.port}`);
        });

        //Event listener for HTTP server "error" event
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(`Port ${this.port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`Port ${this.port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        process.on('uncaughtException', (error: Error) => {
            console.log(error.stack);
        });
    }

}