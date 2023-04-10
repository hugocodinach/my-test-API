import { updateSettingsCredits, getSettings as getSettingsController, refreshSettingsCredits } from "../controllers/settings";

export async function putRefreshSettingsCredits(req, res)
{
    if (!await refreshSettingsCredits())
        return res.status(500).json({ status: "error", code: "RS2" });
    return res.status(200).json({ status: "success", code: "RS1" });
}

export async function putSettingsCredits(req, res)
{
    const { actionsCredits } = req.body;

    if (!actionsCredits?.rock || !actionsCredits?.leaf || !actionsCredits?.scissors)
        return res.status(401).json({ status: "error", code: "PSC2" });

    if (!await updateSettingsCredits(actionsCredits))
        return res.status(500).json({ status: "error", code: "PSC3" });
    return res.status(200).json({ status: "success", code: "PSC2" });
}

export async function getSettings(req, res)
{
    const settings = await getSettingsController();

    if (!settings)
        return res.status(500).json({ status: "error", code: "GGS2" });
    return res.status(200).json({ status: 'success', code: "GGS1", data: settings });
}
