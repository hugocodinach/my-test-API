import { ObjectId } from 'mongodb';
import actionLifetime from '../constants/actionLifeTime';
import { queueActionModel } from "../schemas/queueAction";

export async function addActionToQueue(actionName) {
    const queue = await getQueueActions();
    if (!queue)
        return null;

    const actionObject = new queueActionModel();
    const newDate = queue.length ? new Date(queue[queue.length - 1].launchDate) : new Date();
    newDate.setTime(newDate.getTime() + actionLifetime);

    actionObject.name = actionName;
    actionObject.launchDate = newDate.toISOString();
    try {
        const res = await actionObject.save();

        if (res === null)
            return res;

        return actionObject;
    } catch (error) {
        return null;
    }
}

export async function deleteActionQueue(id, skip = false) {
    try {
        const _id = new ObjectId(id);
        await queueActionModel.deleteOne({ _id });

        if (!skip)
            return true;

        const otherQueueElements = await getQueueActions();

        await Promise.all(otherQueueElements.map(async (action) => {
            try {
                const actionDate = new Date(action.launchDate);
                actionDate.setTime(actionDate.getTime() - actionLifetime);

                action.launchDate = actionDate.toISOString();
                await action.save();
            } catch (error) {
            }
        }));
        return true;
    } catch (error) {
        return false;
    }
}

export async function getQueueActions() {
    try {
        const actions = await queueActionModel.find({});

        return actions;
    } catch (error) {
        return null;
    }
}