import { dbQueue } from './../utils/data';

const queueActionSchema = new dbQueue.Schema({
    name: String,
    launchDate: String
});

export const queueActionModel = dbQueue.model('queue', queueActionSchema);
