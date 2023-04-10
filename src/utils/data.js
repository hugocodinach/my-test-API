//Imports
import mongoose from 'mongoose';

//Database
export const dbQueue = new mongoose.Mongoose();
export const dbGame = new mongoose.Mongoose();

//Config
const mongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

function getdbGameURL()
{
	return process.env.NODE_ENV !== 'test' ? process.env.GAME_DATABASE_LINK : `${process.env.GAME_DATABASE_LINK}-test`;
}

function getdbQueueURL()
{
	return process.env.NODE_ENV !== 'test' ? process.env.QUEUE_DATABASE_LINK : `${process.env.QUEUE_DATABASE_LINK}-test`;
}

async function connectDatabases()
{
	await dbQueue.connect(getdbQueueURL(), mongooseOptions);
	await dbGame.connect(getdbGameURL(), mongooseOptions);
    console.log("Database connection tunnels created.");
	return true;
}

async function deleteDatabases()
{
	await dbQueue.connection.db.dropDatabase();
	await dbGame.connection.db.dropDatabase();
	return true;
}

async function disconnectDatabases()
{
	await dbQueue.disconnect();
	await dbGame.disconnect();
	return true;
}

export {
	connectDatabases,
	disconnectDatabases,
	deleteDatabases,
}
