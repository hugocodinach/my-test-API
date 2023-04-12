import * as dotenv from 'dotenv';
dotenv.config();

import chai from 'chai';
import { requester } from './utils/requester';
import { connectDatabases, deleteDatabases, disconnectDatabases } from '../src/utils/data';
import { initializeData } from '../src/utils/init';

export const assert = chai.assert;

before(async function () {
    console.log("Connecting to test databases...");
    await connectDatabases();
    await initializeData();
    console.log("Connected !");
});

after(async () => {
    console.log("Closing databases...");
    await requester.close();
    await deleteDatabases();
    await disconnectDatabases();
    console.log("Closed !");
});
