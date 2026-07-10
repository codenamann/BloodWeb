import mongoose from "mongoose";

export const NOTIFICATION_TYPES = ['INFORMATIONAL', 'ACTIONABLE'];
export const NOTIFICATION_CHANNELS = ['EMAIL', 'PUSH', 'SMS'];

// an event is an inline button rendered on an ACTIONABLE notification. 
// each action has a lable (button text) and a deep link url.

const actionSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: [true, "Action label is required"],
            trim: true,
            maxlength: 40,
        },
        url: {
            type: String,
            required: [true, "Action URL is required"],
            trim: true,
        },
    },
    { _id: false, }
);

const notificationSchema = new mongoose.Schema(
    {
        // Recipient
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Notification recipient userId is required"],
        },

        // Content
        type: {
            type: String,
            enum: {
                values: NOTIFICATION_TYPES,
                message: "type must be 'INFORMATIONAL' or 'ACTIONABLE'",
            },
            required: [true, "Notification type is required"],
        },

        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
            maxlength: 100,
        },

        body: {
            type: String,
            required: [true, "Notification body is required"],
            trim: true,
            maxlength: 500,
        },

        // Tapping a notification should always navigate somewhere.
        redirectUrl: {
            type: String,
            required: [true, "Notification redirectUrl is required"],
            trim: true,
        },

        // only present on ACTIONABLE notifications.
        // null on informational notifications.
        actions: {
            type: [actionSchema],
            default: null,
        },

        // Delivery channel
        channel: {
            type: String,
            enum: {
                values: NOTIFICATION_CHANNELS,
                message: "channel must be 'EMAIL', 'PUSH', or 'SMS'",
            },
            required: [true, "Notification channel is required"],
        },

        delivered: {
            type: Boolean,
            default: false,
        },

        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Validation

// ACTIONABLE notifications must have at least one action.
// INFORMATIONAL notifications must not have any actions.
notificationSchema.pre("validate", function (next) {
    if (this.type === "ACTIONABLE" && (!this.actions || this.actions.length === 0)) {
        return next(new Error("ACTIONABLE notifications must have at least one action"));
    }
    if (this.type === "INFORMATIONAL" && this.actions && this.actions.length > 0) {
        return next(new Error("INFORMATIONAL notifications must not have any actions"));
    }
    next();
})

// Indexes

// User's notification inbox: unread notifications, most recent first.
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Delivery retry job: find undelivered notifications.
notificationSchema.index({ delivered: 1, createdAt: 1 });

// Channel specific queries (e.g., "all undelivered emails").
notificationSchema.index({ channel: 1, delivered: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
