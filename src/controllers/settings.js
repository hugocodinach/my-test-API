import { settingsModel } from '../schemas/settings';
import computeActionsSettings from '../utils/actionsSettings';

export async function initializeSettings() {
    const settingsObject = new settingsModel();

    const { nextRefresh, actionsCredits } = computeActionsSettings();

    settingsObject.nextRefresh = nextRefresh;
    settingsObject.actionsCredits = actionsCredits;

    try {
        const res = await settingsObject.save();

        if (res === null)
            return res;

        return settingsObject;
    } catch (error) {
        return null;
    }
}

export async function refreshSettingsCredits() {
    try {
        const oldSettings = await getSettings();

        if (!oldSettings)
            return false;

        const newActionSettings = computeActionsSettings(oldSettings.nextRefresh);

        if (!newActionSettings)
            return false;

        await settingsModel.updateOne({}, newActionSettings);

        return true;
    } catch (error) {
        return false;
    }
}

export async function updateSettingsCredits(newCredits) {
    try {
        await settingsModel.updateOne({}, { actionsCredits: newCredits });

        return true;
    } catch (error) {
        return false;
    }
}

export async function getSettings() {
    try {
        const settings = await settingsModel.find({});

        if (settings?.length >= 1)
            return settings[0];
        return null;
    } catch (error) {
        return null;
    }
}