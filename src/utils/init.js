import { getScore, initializeScore } from "../controllers/score";

async function initializeData() {
	try {
		const score = await getScore();

		if (!score)
			await initializeScore();
	} catch (error) {
		console.log(error);
	}
}

export {
    initializeData
};