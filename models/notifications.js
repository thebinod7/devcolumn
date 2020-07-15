const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        entity_type: {
            type: String,
            enum: ["ARTICLE_PUBLISH", "ARTICLE_SCHEDULE", "ARTICLE_REJECT"],
            default: "ARTICLE_PUBLISH"
        },
        entity: { type: String, default: "I am an article" }, // Eg: Article ID
        message: {
            type: String,
            required: true,
            default: "Hey, you got new notification."
        },
        notifiers: {
            users: [{ type: String }], // User IDs
            group: { type: String, enum: ["Admin", "Editor", "Contributor"] } // EG Admins, Editors,
        },
        isRead: { type: Boolean, default: false },
        createdBy: { type: String, default: "BINOD" } // Eg: User ID
    },
    {
        collection: "notifications",
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        toObject: {
            virtuals: true
        },
        toJson: {
            virtuals: true
        }
    }
);

module.exports = mongoose.model("Notifications", schema);
