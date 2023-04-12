//Imports
import { beforeEach } from "mocha";
import { queueActionModel } from "../src/schemas/queueAction";
import { addActionToQueue, getQueueActions } from '../src/controllers/queue';
import { assert } from "./start.test";
import { requester } from "./utils/requester";
import actionLifetime from "../src/constants/actionLifeTime";

describe('Queue', () => {
    describe('GET', () => {

        beforeEach(async () => {
            await queueActionModel.deleteMany();
        });

        it('should get an empty queue', async () => {
            const res = await requester.get('/queue');
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'GQ1');
            assert.equal(res.body.data.length, 0);
        });

        it('should get one queue element', async () => {
            const resBefore = await requester.get('/queue');
    
            assert.equal(resBefore.status, 200);
            assert.equal(resBefore.body.status, 'success');
            assert.equal(resBefore.body.code, 'GQ1');
            assert.equal(resBefore.body.data.length, 0);

            await addActionToQueue('rock');

            const resAfter = await requester.get('/queue');

            assert.equal(resAfter.status, 200);
            assert.equal(resAfter.body.status, 'success');
            assert.equal(resAfter.body.code, 'GQ1');
            assert.equal(resAfter.body.data.length, 1);
            assert.equal(resAfter.body.data[0].name, 'rock');
            assert.isString(resAfter.body.data[0].launchDate);
        });
    })

    describe('POST', () => {

        beforeEach(async () => {
            await queueActionModel.deleteMany();
        });

        it('should not post action (no name provided)', async () => {
            const res = await requester.post('/queue/action');
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PQ2');

            const queue = await getQueueActions();
            assert.equal(queue.length, 0);
        });

        it('should not post action (action type not existing)', async () => {
            const res = await requester.post('/queue/action').send({ name: 'name' });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PQ2');

            const queue = await getQueueActions();
            assert.equal(queue.length, 0);
        });

        it('should post one action to queue', async () => {
            const queueBefore = await getQueueActions();
            assert.equal(queueBefore.length, 0);

            const res = await requester.post('/queue/action').send({ name: 'rock' });
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'PQ1');

            const queueAfter = await getQueueActions();
            assert.equal(queueAfter.length, 1);
            assert.equal(queueAfter[0].name, 'rock');
            assert.isString(queueAfter[0].launchDate);
        });

        it('should post two action to queue with [actionLifeTime] interval', async () => {
            const queueBefore = await getQueueActions();
            assert.equal(queueBefore.length, 0);

            await requester.post('/queue/action').send({ name: 'rock' });
            await requester.post('/queue/action').send({ name: 'leaf' });

            const queueAfter = await getQueueActions();
            assert.equal(queueAfter.length, 2);
            assert.equal(queueAfter[0].name, 'rock');
            assert.isString(queueAfter[0].launchDate);
            assert.equal(queueAfter[1].name, 'leaf');
            assert.isString(queueAfter[1].launchDate);

            const firstDate = new Date(queueAfter[0].launchDate);
            const secondDate = new Date(queueAfter[1].launchDate);

            assert.equal(firstDate.getTime() + actionLifetime, secondDate.getTime());
        });
    })

    describe('DELETE', () => {

        beforeEach(async () => {
            await queueActionModel.deleteMany();
        });

        it('should not delete action (action not existing)', async () => {
            const res = await requester.delete('/queue/action/1');
    
            assert.equal(res.status, 500);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'DQ2');
        });

        it('should delete action', async () => {
            await addActionToQueue('rock');
            await addActionToQueue('rock');

            const queueBefore = await getQueueActions();
            assert.equal(queueBefore.length, 2);

            const res = await requester.delete(`/queue/action/${queueBefore[0]._id}`);
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'DQ1');

            const queueAfter = await getQueueActions();
            assert.equal(queueAfter.length, 1);
            assert.equal(queueAfter[0]._id.toString(), queueBefore[1]._id.toString());
        });

        it('should delete and skip action', async () => {
            await addActionToQueue('rock');
            await addActionToQueue('rock');

            const queueBefore = await getQueueActions();
            assert.equal(queueBefore.length, 2);

            const res = await requester.delete(`/queue/action/${queueBefore[0]._id}?skip=true`);
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'DQ1');

            const queueAfter = await getQueueActions();
            assert.equal(queueAfter.length, 1);
            assert.equal(queueAfter[0]._id.toString(), queueBefore[1]._id.toString());

            const firstDate = new Date(queueBefore[1].launchDate);
            const secondDate = new Date(queueAfter[0].launchDate);

            assert.equal(firstDate.getTime() - actionLifetime, secondDate.getTime());
        });
    })
});
