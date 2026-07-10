import mongoose from "mongoose";

export const MESSAGE_TYPES = ["USER", "SYSTEM"];

// All valid system event types. Adding a new event type here is the
// single change needed to support new automated room messages.
export const SYSTEM_EVENTS = [
    'VOLUNTEER_JOINED',
    'VOLUNTEER_ACCEPTED',
    'VOLUNTEER_BACKUP',
    'VOLUNTEER_WITHDRAWN',
    'MARKED_ON_WAY',
    'DISTANCE_UPDATED',
    'REQUEST_FULFILLED',
    'REQUEST_COMPLETED',
    'ROOM_CLOSED'
];

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CoordinationRoom",
            required: [true, "Room ID is required"],
        },

        // null when type is system, required when type is user
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        type: {
            type: String,
            enum: {
                values: MESSAGE_TYPES,
                message: "{VALUE} is not a valid message type",
            },
            required: [true, "Message type is required"],
        },

        text: {
            type: String,
            required: [true, "Message text is required"],
            trim: true,
            maxLength: [1000, "Message text cannot exceed 1000 characters"],
        },

        // null when type is user
        event: {
            type: String,
            enum: {
                values: SYSTEM_EVENTS,
                message: "{VALUE} is not a valid system event type",
            },
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Validation 

// Cross-field validation enforcing the USER / SYSTEM contract.
messageSchema.pre("validate", function (next) {
    if (this.type === "USER" && !this.senderId) {
        return next(new Error("USER messages must have a senderId"));
    }
    if (this.type === "SYSTEM" && this.senderId) {
        return next(new Error("SYSTEM messages cannot have a senderId"));
    }
    if (this.type === "SYSTEM" && !this.event) {
        return next(new Error("SYSTEM messages must have an event type"));
    }
    if (this.type === "USER" && this.event) {
        return next(new Error("USER messages cannot have an event type"));
    }
    next();
});

// Indexes

// Primary query: all messages for a room in a chronological order
// this is the only query path for message history
messageSchema.index({ roomId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;