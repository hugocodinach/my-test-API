import { dbGame } from './../utils/data';

const scoreSchema = new dbGame.Schema({
    playerScore: Number,
    computerScore: Number
});

export const scoreModel = dbGame.model('score', scoreSchema);
