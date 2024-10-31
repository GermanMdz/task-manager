import express from 'express';
import 'reflect-metadata';
import { DataSource } from "typeorm"
import { DataSourceOptions } from "typeorm";
import { router } from "./routes/routes";
const ormconfig: DataSourceOptions = require("../ormconfig.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const AppDataSource = new DataSource(ormconfig);

AppDataSource.initialize()
    .then(() => {
        console.log('Conectado a la base de datos MySQL');
        app.use("/", router);
    })
    .catch((error) => console.log(error))

export default app;