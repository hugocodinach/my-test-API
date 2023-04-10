import { ObjectId } from 'mongodb';
import { queueActionModel } from "../schemas/queueAction";

export async function addActionToQueue(action) {
    const actionObject = new queueActionModel();

    actionObject.name = action.name;
    actionObject.launchDate = action.launchDate;
    try {
        const res = await actionObject.save();

        if (res === null)
            return res;

        return actionObject;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function deleteActionQueue(id) {
    try {
        const _id = new ObjectId(id);
        await queueActionModel.deleteOne({ _id });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getQueueActions() {
    try {
        const actions = await queueActionModel.find({});

        return actions;
    } catch (error) {
        console.log(error);

        return null;
    }
}