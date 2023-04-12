import creditsRefreshInterval from "../../src/constants/creditsRefreshInterval";
import { settingsModel } from "../../src/schemas/settings";
import computeActionsSettings from "../../src/utils/actionsSettings";

export async function initializePassedSettings() {
    const settingsObject = new settingsModel();

    const { actionsCredits, nextRefresh } = computeActionsSettings();

    const oldDate = new Date(nextRefresh);
    oldDate.setTime(oldDate.getTime() - creditsRefreshInterval * 2)

    settingsObject.nextRefresh = oldDate.toISOString();
    settingsObject.actionsCredits = actionsCredits;
    
    return await settingsObject.save();
}