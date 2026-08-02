import BloodRequest from "../models/BloodRequest.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import Message from "../models/Message.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";

export async function isRoomParticipant(requestId, senderId) {
    const [isVolunteer, isRequester] = await Promise.all([
        VolunteerResponse.exists({
            requestId,
            donorId: senderId,
            status: { $ne: "WITHDRAWN" }
        }),
        BloodRequest.exists({
            _id: requestId,
            createdBy: senderId
        })
    ]);

    return !!(isRequester || isVolunteer);
}

export async function sendMessage(roomId, senderId, text) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId, status: 'ACTIVE' },
        {
            requestId: 1,
            cooldownEnabled: 1,
            messageCooldownSeconds: 1
        }
    ).lean();
    if (!room) throw new Error("Room doesn't exist or has been closed");

    const isParticipant = await isRoomParticipant(room.requestId, senderId);
    if (!isParticipant) throw new Error('You are not participant of this room');

    if (room.cooldownEnabled) {
        const cooldown = await getRemainingCooldown(senderId, roomId, room.messageCooldownSeconds);
        /* API design suggestion
            {
                success: false,
                type: 'COOLDOWN',
                cooldown
            } 
        */
        if (cooldown > 0) return {
            type: "COOLDOWN",
            cooldown
        };
    }

    const message = await Message.create({
        roomId,
        senderId,
        type: 'USER',
        text
    })

    /* API design suggestion
        {
            success: true,
            type: 'MESSAGE',
            message
        } 
    */

    return {
        type: "MESSAGE",
        message
    };
};

export async function getRemainingCooldown(senderId, roomId, messageCooldownSeconds) {
    const lastMessage = await Message.findOne(
        {
            senderId,
            roomId
        },
        { createdAt: 1 }
    ).sort({ createdAt: -1 }).lean();
    if (!lastMessage) return 0;

    const cooldownMs = messageCooldownSeconds * 1000;
    const elapsedMs = Date.now() - lastMessage.createdAt.getTime();
    const remainingSeconds = Math.ceil(Math.max(0, cooldownMs - elapsedMs) / 1000);

    return remainingSeconds;
}

export async function sendSystemMessage(roomId, event) {
    const room = await CoordinationRoom.exists({ _id: roomId });
    if (!room) throw new Error("Room doesn't exist!");

    return Message.create({
        roomId,
        event,
        type: 'SYSTEM'
    });
}

export async function getMessages(roomId, senderId) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId, status: 'ACTIVE' },
        { requestId: 1 }
    ).lean();
    if (!room) throw new Error("Room doesn't exist or has been closed");

    const isParticipant = await isRoomParticipant(room.requestId, senderId);
    if (!isParticipant) throw new Error("You're not a participant of this room");

    return Message.find({ roomId }).sort({ createdAt: 1 });
}