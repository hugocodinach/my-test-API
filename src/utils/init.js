import { getScore, initializeScore } from "../controllers/score";
import { getSettings, initializeSettings } from "../controllers/settings";

async function initializeScoreData() {
	try {
		const score = await getScore();

		if (!score)
			await initializeScore();
	} catch (error) {
	}
}

async function initializeSettingsData() {
	try {
		const settings = await getSettings();

		if (!settings)
			await initializeSettings();
	} catch (error) {
	}
}

async function initializeData() {
	try {
        await initializeScoreData();
        await initializeSettingsData();
	} catch (error) {
	}
}

export {
    initializeData
};