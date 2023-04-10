//Imports
import express from 'express';
import { deleteQueueAction, getQueue, postQueueAction } from './routes/queue';
import { getScore, putScore } from './routes/score';
import { getSettings, putRefreshSettingsCredits, putSettingsCredits } from './routes/settings';

const router = express.Router();

router.route('/queue').get(getQueue);
router.route('/queue/action').post(postQueueAction);
router.route('/queue/action/:id').delete(deleteQueueAction);

router.route('/score').get(getScore);
router.route('/score').put(putScore);

router.route('/settings').get(getSettings);
router.route('/settings/actionsCredits').put(putSettingsCredits);
router.route('/settings/nextRefresh').put(putRefreshSettingsCredits);

router.route('*').all(function(req, res) {
    return res.status(404).json({'error': 'API route not found'});
});

export { router }