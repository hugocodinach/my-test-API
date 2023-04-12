import { scoreModel } from '../schemas/score';

export async function initializeScore() {
    const scoreObject = new scoreModel();

    scoreObject.playerScore = 0;
    scoreObject.computerScore = 0;

    try {
        const res = await scoreObject.save();

        if (res === null)
            return res;

        return scoreObject;
    } catch (error) {
        return null;
    }
}

export async function updateScore(score) {
    try {
        await scoreModel.updateOne({}, score);

        return true;
    } catch (error) {
        return false;
    }
}

export async function getScore() {
    try {
        const score = await scoreModel.find({});

        if (score?.length >= 1)
            return score[0];
        return null;
    } catch (error) {
        return null;
    }
}