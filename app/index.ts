import { App } from './app';
import logger from 'morgan';
import express from "express";
import Lector from "./models/Lector";
import Department from "./models/Department";
import DepartmentController from "./controllers/DepartmentController";
import LectorController from "./controllers/LectorController";
import helmet from "helmet";

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
app.initDatabase(
    {
      host: 'mongodb',
      port: 27017,
      database: process.env.MONGO_INITDB_DATABASE,
      password: process.env.MONGO_INITDB_DATABASE,
      username: process.env.MONGO_INITDB_DATABASE,
    },
    [
      Lector,
      Department
    ]
);