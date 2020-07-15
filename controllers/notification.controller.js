const NotifyModel = require("../models/notifications");

const add = payload => {
    let obj = new NotifyModel(payload);
    return obj.save();
};

const list = () => {
    return NotifyModel.find()
        .sort({ created_at: -1 })
        .limit(5);
};

module.exports = { add, list };
