import mongoose from "mongoose";

export const ROOM_STATUSES = ['ACTIVE', 'CLOSED'];

const coordinationRoomSchema = new mongoose.Schema(
    {
        // Ownership
        // 1:1 with BloodRequest. Unique constraint inforced at Index level
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodRequest",
            required: [true, "Blood request ID is required"],
        },

        // Status
        status: {
            type: String,
            enum: {
                values: ROOM_STATUSES,
                message: "{VALUE} is not a valid room status",
            },
            default: "ACTIVE",
            required: true,
        },

        // Admin Controls
        // The admin can pin one message for everyone to see
        // No pinned message by default
        pinnedMessageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        // Cooldown for sending messages to prevent spam. In seconds.
        messageCooldownSeconds: {
            type: Number,
            default: null,
            min: [1, "Message cooldown must be at least 1 second"],
        },

        cooldownEnabled: {
            type: Boolean,
            default: false,
        },

        // Null until the room is closed
        closedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes

// Enforce 1:1 relationship between room and its request
// Prevent duplicate room from being created in race conditions
coordinationRoomSchema.index({ requestId: 1 }, { unique: true });

// room status queries ( admin, cleanup jobs )
coordinationRoomSchema.index({ status: 1 });

const CoordinationRoom = mongoose.model("CoordinationRoom", coordinationRoomSchema);
export default CoordinationRoom;