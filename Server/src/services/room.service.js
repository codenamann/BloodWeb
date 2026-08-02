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
    ).populate('donorId', 'name bloodGroup').lean();

    const request = await BloodRequest.findOne(
        { _id: requestId },
        { createdBy: 1 }
    ).populate('createdBy', 'name').lean();
    if (!request) throw new Error('Blood Request not found');

    return {
        requester: request.createdBy,
        volunteers
    };
}

export async function pinMessage(roomId, messageId, requesterId) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId },
        {
            pinnedMessageId: 1,
            adminId: 1
        }
    );
    if (!room) throw new Error('Room not found ');
    if (!room.adminId.equals(requesterId)) throw new Error('Permission denied');

    if (! await Message.exists({ _id: messageId, roomId })) throw new Error('Message not found');
    room.pinnedMessageId = messageId;
    return room.save();
}

export async function toggleCooldown(roomId, requesterId) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId, },
        {
            cooldownEnabled: 1,
            adminId: 1
        }
    )
    if (!room) throw new Error('Room not found');
    if (!room.adminId.equals(requesterId)) throw new Error('Permission denied');

    room.cooldownEnabled = !room.cooldownEnabled;
    return room.save();
}

export async function updateCooldown(roomId, requesterId, messageCooldownSeconds) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId, },
        {
            messageCooldownSeconds: 1,
            adminId: 1
        }
    )
    if (!room) throw new Error('Room not found');
    if (!room.adminId.equals(requesterId)) throw new Error('Permission denied');

    room.messageCooldownSeconds = messageCooldownSeconds;
    return room.save();
}

export async function closeRoom(roomId, requesterId) {
    const room = await CoordinationRoom.findOne(
        { _id: roomId },
        {
            status: 1,
            closedAt: 1,
            adminId: 1
        }
    );
    if (!room) throw new Error('Room not found');
    if (!room.adminId.equals(requesterId)) throw new Error('Permission denied');

    room.status = 'CLOSED';
    room.closedAt = new Date();

    return room.save();
}