//Imports
import actionsCreditCost from "../src/constants/actionsCreditCost";
import actionsMaxCredit from "../src/constants/actionsMaxCredit";
import creditsRefreshInterval from "../src/constants/creditsRefreshInterval";
import minCreditsPercent from "../src/constants/minCreditsPercent";
import { getSettings } from "../src/controllers/settings";
import { settingsModel } from "../src/schemas/settings";
import computeActionsSettings from "../src/utils/actionsSettings";
import { initializeData } from "../src/utils/init";
import { assert } from "./start.test";
import { requester } from "./utils/requester";
import { initializePassedSettings } from "./utils/settings";

describe('settings', () => {
    describe('GET', () => {
        it('should not get settings', async () => {
            await settingsModel.deleteMany();
            const res = await requester.get('/settings');
    
            assert.equal(res.status, 500);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'GGS2');
        });

        it('should get score', async () => {
            await initializeData();
            const res = await requester.get('/settings');
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'GGS1');

            assert.isString(res.body.data.nextRefresh);
            assert.equal(res.body.data.actionsCredits.rock.maxCredit, actionsMaxCredit.rock);
            assert.isAtLeast(res.body.data.actionsCredits.rock.remainingCredits, Math.round(actionsMaxCredit.rock * minCreditsPercent));
            assert.isAtMost(res.body.data.actionsCredits.rock.remainingCredits, actionsMaxCredit.rock);
            assert.equal(res.body.data.actionsCredits.rock.creditCost, actionsCreditCost.rock);

            assert.equal(res.body.data.actionsCredits.leaf.maxCredit, actionsMaxCredit.leaf);
            assert.isAtLeast(res.body.data.actionsCredits.leaf.remainingCredits, Math.round(actionsMaxCredit.leaf * minCreditsPercent));
            assert.isAtMost(res.body.data.actionsCredits.leaf.remainingCredits, actionsMaxCredit.leaf);
            assert.equal(res.body.data.actionsCredits.leaf.creditCost, actionsCreditCost.leaf);

            assert.equal(res.body.data.actionsCredits.scissors.maxCredit, actionsMaxCredit.scissors);
            assert.isAtLeast(res.body.data.actionsCredits.scissors.remainingCredits, Math.round(actionsMaxCredit.scissors * minCreditsPercent));
            assert.isAtMost(res.body.data.actionsCredits.scissors.remainingCredits, actionsMaxCredit.scissors);
            assert.equal(res.body.data.actionsCredits.scissors.creditCost, actionsCreditCost.scissors);
        });
    })

    describe('PUT (actionsCredits)', () => {
        it('should not update actionsCredits (no rock provided)', async () => {
            const res = await requester.put('/settings/actionsCredits').send({ actionsCredits: {
                leaf: { maxCredit: actionsMaxCredit.leaf, remainingCredits: 0, creditCost: actionsCreditCost.leaf },
                scissors: { maxCredit: actionsMaxCredit.scissors, remainingCredits: 0, creditCost: actionsCreditCost.scissors }
            } });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PSC2');

            const settings = await getSettings();
            assert.notEqual(settings.actionsCredits.leaf.remainingCredits, 0);
        });

        it('should not update actionsCredits (no leaf provided)', async () => {
            const res = await requester.put('/settings/actionsCredits').send({ actionsCredits: {
                rock: { maxCredit: actionsMaxCredit.rock, remainingCredits: 0, creditCost: actionsCreditCost.rock },
                scissors: { maxCredit: actionsMaxCredit.scissors, remainingCredits: 0, creditCost: actionsCreditCost.scissors }
            } });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PSC2');

            const settings = await getSettings();
            assert.notEqual(settings.actionsCredits.rock.remainingCredits, 0);
        });

        it('should not update actionsCredits (no scissors provided)', async () => {
            const res = await requester.put('/settings/actionsCredits').send({ actionsCredits: {
                rock: { maxCredit: actionsMaxCredit.rock, remainingCredits: 0, creditCost: actionsCreditCost.rock },
                leaf: { maxCredit: actionsMaxCredit.leaf, remainingCredits: 0, creditCost: actionsCreditCost.leaf },
            } });
    
            assert.equal(res.status, 401);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'PSC2');

            const settings = await getSettings();
            assert.notEqual(settings.actionsCredits.leaf.remainingCredits, 0);
        });

        it('should update actionsCredits', async () => {
            const res = await requester.put('/settings/actionsCredits').send({ actionsCredits: {
                rock: { maxCredit: actionsMaxCredit.rock, remainingCredits: 0, creditCost: actionsCreditCost.rock },
                leaf: { maxCredit: actionsMaxCredit.leaf, remainingCredits: 0, creditCost: actionsCreditCost.leaf },
                scissors: { maxCredit: actionsMaxCredit.scissors, remainingCredits: 0, creditCost: actionsCreditCost.scissors }
            } });
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'PSC1');

            const settings = await getSettings();
            assert.equal(settings.actionsCredits.rock.remainingCredits, 0);
            assert.equal(settings.actionsCredits.leaf.remainingCredits, 0);
            assert.equal(settings.actionsCredits.scissors.remainingCredits, 0);
        });
    })

    describe('PUT (nextRefresh)', () => {
        it('should not update actionsCredits (no settings)', async () => {
            await settingsModel.deleteMany();
            const res = await requester.put('/settings/nextRefresh');
    
            assert.equal(res.status, 500);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'RS2');
        });

        it('should not update actionsCredits (nextRefresh not passed)', async () => {
            await initializeData();

            const res = await requester.put('/settings/nextRefresh');
    
            assert.equal(res.status, 500);
            assert.equal(res.body.status, 'error');
            assert.equal(res.body.code, 'RS2');
        });

        it('should update actionsCredits', async () => {
            await settingsModel.deleteMany();
            const oldSettings = await initializePassedSettings();

            const res = await requester.put('/settings/nextRefresh');
    
            assert.equal(res.status, 200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.code, 'RS1');

            const settings = await getSettings();
            const newActionSettings = computeActionsSettings(oldSettings.nextRefresh);

            const firstDate = new Date(newActionSettings.nextRefresh);
            const secondDate = new Date(settings.nextRefresh);

            assert.equal(firstDate.getTime(), secondDate.getTime());
        });
    })
});
