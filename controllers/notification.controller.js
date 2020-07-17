const NotifyModel = require("../models/notifications");
const { DataUtils } = require("./data");

const add = payload => {
    let _users = [];
    if (payload.users) {
        let _arr = payload.users.split(",");
        for (let u of _arr) {
            let obj = { userId: u };
            _users.push(obj);
        }
        payload.notifiers = _users;
    }
    let obj = new NotifyModel(payload);
    return obj.save();
};

const list = async userid => {
    let filter = {};
    // let q = JSON.parse(query);
    // if (q.lastFetchedAt) {
    //     filter = { created_at: { $gt: new Date(q.lastFetchedAt) } };
    // }
    let user = userid.toString();
    console.log(user);
    let data = await NotifyModel.aggregate([
        { $sort: { created_at: -1 } },
        { $limit: 15 },
        {
            $match: {
                $and: [
                    {
                        notifiers: {
                            $elemMatch: {
                                isRead: false,
                                userId: user
                            }
                        }
                    },
                    filter
                ]
            }
        }
    ]);
    console.log("Data:", data);
    return data;
};

const updateRead = (notifyId, userId) => {
    let user = userId.toString();
    return NotifyModel.update(
        { _id: notifyId, "notifiers.userId": user },
        { $set: { "notifiers.$.isRead": true } },
        { new: true }
    );
};

const listAll = ({ limit = 100, start = 0, user }) => {
    return DataUtils.paging({
        start,
        limit,
        sort: { created_at: -1 },
        model: NotifyModel,
        query: [
            {
                $match: {
                    notifiers: {
                        $elemMatch: {
                            isRead: false
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$notifiers",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]
    });
};
module.exports = { add, list, listAll, updateRead };
