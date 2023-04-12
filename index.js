import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabases } from "./src/utils/data";
import { router } from "./src/router";
import { initializeData } from './src/utils/init';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors({origin: '*'}));
app.use('/', router);

if (process.env.NODE_ENV !== 'test') {
    const port = parseInt(process.env.PORT);

    connectDatabases().then(_ => {
        console.log("Databse connected !");
        initializeData().then(_ => {
            console.log("Data initialized !");
        })
    }).catch(err => {
        console.log("Database connection tunnels creation failed ! " + err.message);
        process.exit(42);
    });

    app.listen(port, () => {
        console.log(`app is listening to port ${port}`);
    });
}

export { app };