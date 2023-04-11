import { updateScore, getScore as getScoreController } from "../controllers/score";

export async function putScore(req, res)
{
    const { playerScore, computerScore } = req.body;

    if (playerScore === undefined || computerScore === undefined)
        return res.status(401).json({ status: "error", code: "PS2" });

    if (!await updateScore({ playerScore, computerScore }))
        return res.status(500).json({ status: "error", code: "PS3" });
    return res.status(200).json({ status: "success", code: "PS1", data: {} });
}

export async function getScore(req, res)
{
    const score = await getScoreController();

    if (!score)
        return res.status(500).json({ status: "error", code: "GS2" });
    return res.status(200).json({ status: 'success', code: "GS1", data: score });
}
