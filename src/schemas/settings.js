import { dbGame } from './../utils/data';

const actionCreditsSchema = new dbGame.Schema({
    maxCredit: Number,
    remainingCredits: Number,
    creditCost: Number
}, {_id: false});

const actionsCreditsSchema = new dbGame.Schema({
    rock: actionCreditsSchema,
    leaf: actionCreditsSchema,
    scissors: actionCreditsSchema
}, {_id: false});

const settingsSchema = new dbGame.Schema({
    actionsCredits: actionsCreditsSchema,
    nextRefresh: String
});

export const settingsModel = dbGame.model('settings', settingsSchema);
