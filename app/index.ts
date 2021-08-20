import { App } from './app';
import logger from 'morgan';
import express from "express";
import DepartmentController from "./controllers/DepartmentController";
import LectorController from "./controllers/LectorController";
import helmet from "helmet";
import { MONGO_OPTIONS, MONGO_URI } from "./config/db";

const app = new App({
  port: 3000,
  controllers: [
      new DepartmentController(),
      new LectorController(),
  ],
  middlewares: [
    express.json(),
    express.urlencoded({ extended: false }),
    logger('dev'),
    helmet.hidePoweredBy()
  ],
});

app.bootstrap();
app.initDatabase(MONGO_URI, MONGO_OPTIONS);