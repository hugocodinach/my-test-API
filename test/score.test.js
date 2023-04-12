//Imports
import { getScore } from "../src/controllers/score";
import { scoreModel } from "../src/schemas/score";
import { initializeData } from "../src/utils/init";
import { assert } from "./start.test";
import { requester } from "./utils/requester";

describe('score', () => {
    describe('GET', () => {
        it('should not get score', async () => {
            await scoreModel.deleteMany();
            const res = await requester.get('/score');
    
            assert.equal(res.status, 500);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'GS2');
        });

        it('should get score', async () => {
            await initializeData();
            const res = await requester.get('/score');
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'GS1');
            assert.equal(res.body.data.playerScore, 0);
            assert.equal(res.body.data.computerScore, 0);
        });
    })

    describe('PUT', () => {
        it('should not update score (no playerScore provided)', async () => {
            const res = await requester.put('/score').send({ computerScore: 1 });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PS2');

            const score = await getScore();
            assert.equal(score.playerScore, 0);
            assert.equal(score.computerScore, 0);
        });

        it('should not update score (no computerScore provided)', async () => {
            const res = await requester.put('/score').send({ playerScore: 1 });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PS2');

            const score = await getScore();
            assert.equal(score.playerScore, 0);
            assert.equal(score.computerScore, 0);
        });

        it('should update score', async () => {
            const scoreBefore = await getScore();
            assert.equal(scoreBefore.playerScore, 0);
            assert.equal(scoreBefore.computerScore, 0);

            const res = await requester.put('/score').send({ playerScore: 1, computerScore: 1 });
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'PS1');

            const scoreAfter = await getScore();
            assert.equal(scoreAfter.playerScore, 1);
            assert.equal(scoreAfter.computerScore, 1);
        });
    })
});
