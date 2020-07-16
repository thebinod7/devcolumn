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

const list = async () => {
    let data = await NotifyModel.aggregate([
        { $sort: { created_at: -1 } },
        { $limit: 10 },
        {
            $match: {
                $and: [
                    {
                        notifiers: {
                            $elemMatch: {
                                isRead: false
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$notifiers",
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
    return data;
};

// const listAll = async () => {
//     let data = await NotifyModel.aggregate([
//         { $sort: { created_at: -1 } },
//         { $limit: 10 },
//         {
//             $match: {
//                 notifiers: {
//                     $elemMatch: {
//                         isRead: false
//                     }
//                 }
//             }
//         },
//         {
//             $unwind: { path: "$notifiers", preserveNullAndEmptyArrays: true }
//         },
//         {
//             $project: {
//                 entity: 1,
//                 entity_type: 1,
//                 notifiers: 1
//             }
//         }
//     ]);
//     // .unwind("notifiers.userId");
//     //  .group({ _id: "$notifiers.userId", data: { $push: "$notifiers" } });

//     console.log("Data===", data);

//     return data;
// };

const listAll = ({ limit = 100, start = 0 }) => {
    return DataUtils.paging({
        start,
        limit,
        sort: { created_at: -1 },
        model: NotifyModel,
        query: [
            {
                $match: {
                    users: {
                        $elemMatch: {
                            isRead: false
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]
    });
};
module.exports = { add, list, listAll };
