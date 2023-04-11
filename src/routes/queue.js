import { addActionToQueue, deleteActionQueue, getQueueActions } from "../controllers/queue";

export async function postQueueAction(req, res)
{
    const { name, launchDate } = req.body;

    if (!name || !launchDate)
        return res.status(401).json({ status: "error", code: "PQ2" });

    if (!await addActionToQueue({ name, launchDate }))
        return res.status(500).json({ status: "error", code: "PQ3" });
    return res.status(200).json({ status: "success", code: "PQ1", data: {} });
}

export async function deleteQueueAction(req, res)
{
    const { id } = req.params;
    const { skip = false } = req.query;

    if (!id)
        return res.status(401).json({ status: "error", code: "DQ2" });

    if (!await deleteActionQueue(id, skip))
        return res.status(500).json({ status: "error", code: "DQ3" });
    return res.status(200).json({ status: "success", code: "DQ1", data: {} });
}

export async function getQueue(req, res)
{
    const actions = await getQueueActions();

    if (!actions)
        return res.status(500).json({ status: "error", code: "GQ2" });
    return res.status(200).json({ status: 'success', code: "GQ1", data: actions });
}
