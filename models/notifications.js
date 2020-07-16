const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        entity_type: {
            type: String,
            enum: ["ARTICLE_PUBLISH", "ARTICLE_SCHEDULE", "ARTICLE_REJECT"],
            default: "ARTICLE_PUBLISH"
        },
        entity: { type: String, default: "I am an article" }, // Eg: Article ID
        redirect_url: { type: String, default: "https://devcolumn.com" },
        message: {
            type: String,
            required: true,
            default: "Hey, you got new notification."
        },
        notifiers: [
            {
                _id: false,
                userId: { type: String },
                isRead: { type: Boolean, default: false }
            }
        ], // User IDs
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
