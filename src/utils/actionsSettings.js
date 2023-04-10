import actionsCreditCost from "../constants/actionsCreditCost";
import actionsMaxCredit from "../constants/actionsMaxCredit";
import creditsRefreshInterval from "../constants/creditsRefreshInterval";
import minCreditsPercent from "../constants/minCreditsPercent";

const getRandomValueInRange = (maxValue) => {
    const minValue = maxValue * minCreditsPercent;
    const brutValue = Math.random() * (maxValue - minValue) + minValue;

    return Math.round(brutValue);
}

const computeActionsSettings = (oldRefreshDate) => {
    const actionsCreditsMap = {
        'rock': {
            maxCredit: actionsMaxCredit.rock,
            remainingCredits: getRandomValueInRange(actionsMaxCredit.rock),
            creditCost: actionsCreditCost.rock
        },
        'leaf': {
            maxCredit: actionsMaxCredit.leaf,
            remainingCredits: getRandomValueInRange(actionsMaxCredit.leaf),
            creditCost: actionsCreditCost.leaf
        },
        'scissors': {
            maxCredit: actionsMaxCredit.scissors,
            remainingCredits: getRandomValueInRange(actionsMaxCredit.scissors),
            creditCost: actionsCreditCost.scissors
        }
    };

    const now = new Date();
    const newDate = oldRefreshDate ? new Date(oldRefreshDate) : new Date();

    if (oldRefreshDate && newDate.getTime() > now.getTime())
        return null;

    if (oldRefreshDate) {
        while (newDate.getTime() <= now.getTime())
            newDate.setTime(newDate.getTime() + creditsRefreshInterval);
    } else {
        newDate.setTime(newDate.getTime() + creditsRefreshInterval);
    }

    const actionsSettings = {
        actionsCredits: actionsCreditsMap,
        nextRefresh: newDate.toISOString()
    };

    return actionsSettings;
}

export default computeActionsSettings;