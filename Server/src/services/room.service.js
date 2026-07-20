import BloodRequest from "../models/BloodRequest.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import Message from "../models/Message.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";

export async function createRoom(requestId) {
    const existing = await CoordinationRoom.findOne({ requestId });
    if (existing) return existing;

    const request = await BloodRequest.findOne({ _id: requestId }, { createdBy: 1 });
    if (!request) throw new Error('Request not found');

    const room = await CoordinationRoom.create({ requestId, adminId: request.createdBy });
    return room;
}

export async function getRoomByRequestId(requestId) {
    const room = await CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
    if (!room) throw new Error('No room found');

    return room;
}

export async function getRoomParticipants(requestId) {
    const volunteers = await VolunteerResponse.find(
        {
            requestId,
            status: { $ne: 'WITHDRAWN' }
        }
    ).populate('donorId', 'name bloodGroup');

    const request = await BloodRequest.findOne({ _id: requestId }, { createdBy: 1 }).lean();
    return {
        requesterId: request.createdBy,
        volunteers
    };
}

export async function pinMessage(roomId, messageId, requesterId) {
    const room = await CoordinationRoom.findOne({ _id: roomId, adminId: requesterId });
    if (!room) throw new Error('Room not found or permission denied');

    if (! await Message.exists({ _id: messageId, roomId })) throw new Error('Message not found');
    room.pinnedMessageId = messageId;
    return room.save();
}

export async function toggleCooldown(roomId, requesterId) {
    const room = await CoordinationRoom.findOne({ _id: roomId, adminId: requesterId }, { cooldownEnabled: 1 })
    if (!room) throw new Error('Room not found or permission denied');

    room.cooldownEnabled = !room.cooldownEnabled;
    return room.save();
}

export async function updateCooldown(roomId, requesterId, messageCooldownSeconds) {
    const room = await CoordinationRoom.findOne(
        {
            _id: roomId,
            adminId: requesterId
        }, { messageCooldownSeconds: 1 }
    )
    if (!room) throw new Error('Room not found or permission denied');

    room.messageCooldownSeconds = messageCooldownSeconds;
    return room.save();
}

export async function closeRoom(roomId, requesterId) {
    const room = await CoordinationRoom.findOne(
        {
            _id: roomId,
            adminId: requesterId
        },
        {
            status: 1,
            closedAt: 1
        }
    );
    if (!room) throw new Error('Room not found or permission denied');

    room.status = 'CLOSED';
    room.closedAt = new Date();

    return room.save();
}