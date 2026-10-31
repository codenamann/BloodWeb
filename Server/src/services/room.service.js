import mongoose from "mongoose";
import BloodRequest from "../models/BloodRequest.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import Message from "../models/Message.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";
import AppError from "../middleware/appError.js";
import { isRoomParticipant } from "./message.service.js";
import { emitToRoom } from "../utils/socket.js";

export async function createRoom(requestId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid blood request ID', 400);
    }

    const existing = await CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
    if (existing) return existing;

    const request = await BloodRequest.findOne({ _id: requestId }, { createdBy: 1 });
    if (!request) throw new AppError('Blood request not found', 404);

    try {
        const room = await CoordinationRoom.create({ requestId, adminId: request.createdBy });
        return room;
    } catch (err) {
        if (err.code === 11000) {
            return CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
        }
        throw err;
    }
}

export async function getOrCreateRoomForUser(requestId, userId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid blood request ID', 400);
    }

    const request = await BloodRequest.findOne({ _id: requestId }, { createdBy: 1, status: 1 });
    if (!request) throw new AppError('Blood request not found', 404);

    const isParticipant = await isRoomParticipant(requestId, userId);
    if (!isParticipant) {
        throw new AppError('You are not authorized to access this coordination room', 403);
    }

    let room = await CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
    if (!room) {
        try {
            room = await CoordinationRoom.create({ requestId, adminId: request.createdBy });
        } catch (err) {
            if (err.code === 11000) {
                room = await CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
            } else {
                throw err;
            }
        }
    }

    return room;
}

export async function getRoomByRequestId(requestId, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid blood request ID', 400);
    }

    if (userId) {
        const isParticipant = await isRoomParticipant(requestId, userId);
        if (!isParticipant) {
            throw new AppError('You are not authorized to access this coordination room', 403);
        }
    }

    const room = await CoordinationRoom.findOne({ requestId }).populate('pinnedMessageId');
    if (!room) throw new AppError('Coordination room not found', 404);

    return room;
}

export async function getRoomParticipants(requestId, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid blood request ID', 400);
    }

    if (userId) {
        const isParticipant = await isRoomParticipant(requestId, userId);
        if (!isParticipant) {
            throw new AppError('You are not authorized to view participants of this room', 403);
        }
    }

    const [rawVolunteers, request] = await Promise.all([
        VolunteerResponse.find(
            {
                requestId,
                status: { $ne: 'WITHDRAWN' }
            }
        ).populate('donorId', 'name bloodGroup avatarType email phone').lean(),
        BloodRequest.findOne(
            { _id: requestId },
            { createdBy: 1 }
        ).populate('createdBy', 'name bloodGroup avatarType email phone').lean()
    ]);

    if (!request) throw new AppError('Blood request not found', 404);

    const viewerIdStr = userId?.toString();
    const creatorIdStr = (request.createdBy?._id || request.createdBy)?.toString();
    const isCreator = Boolean(viewerIdStr && creatorIdStr && viewerIdStr === creatorIdStr);

    const isViewerAcceptedVolunteer = rawVolunteers.some(
        (v) => (v.donorId?._id?.toString() || v.donorId?.toString()) === viewerIdStr && v.status === 'ACCEPTED'
    );

    // Requester contact info is revealed only to the requester themselves or accepted volunteers
    const canAccessRequesterContact = isCreator || isViewerAcceptedVolunteer;
    const sanitizedRequester = {
        _id: request.createdBy?._id,
        name: request.createdBy?.name || 'Requester',
        bloodGroup: request.createdBy?.bloodGroup,
        avatarType: request.createdBy?.avatarType,
        ...(canAccessRequesterContact && {
            email: request.createdBy?.email,
            phone: request.createdBy?.phone,
        }),
    };

    // Sanitize each volunteer response
    const sanitizedVolunteers = rawVolunteers.map((v) => {
        const donorDoc = v.donorId && typeof v.donorId === 'object' ? v.donorId : {};
        const donorIdStr = donorDoc._id?.toString() || v.donorId?.toString() || '';
        const isSelf = Boolean(viewerIdStr && donorIdStr && viewerIdStr === donorIdStr);
        const canAccessVolunteerContact = isSelf || (isCreator && v.status === 'ACCEPTED');

        const sanitizedDonor = {
            _id: donorIdStr,
            name: donorDoc.name || 'Verified Donor',
            bloodGroup: donorDoc.bloodGroup || null,
            avatarType: donorDoc.avatarType || 'alex',
            ...(canAccessVolunteerContact && {
                email: donorDoc.email,
                phone: donorDoc.phone,
            }),
        };

        return {
            _id: v._id.toString(),
            requestId: v.requestId.toString(),
            donorId: sanitizedDonor,
            donor: sanitizedDonor,
            status: v.status,
            estimatedDistanceKm:
                typeof v.estimatedDistanceKm === 'number'
                    ? Math.round(v.estimatedDistanceKm * 10) / 10
                    : null,
            createdAt: v.createdAt,
        };
    });

    return {
        requester: sanitizedRequester,
        volunteers: sanitizedVolunteers
    };
}

export async function pinMessage(roomId, messageId, requesterId) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError('Coordination room not found', 404);
    if (!room.adminId.equals(requesterId)) throw new AppError('Only the room admin can pin messages', 403);

    if (messageId) {
        const messageExists = await Message.exists({ _id: messageId, roomId });
        if (!messageExists) throw new AppError('Message not found in this room', 404);
        room.pinnedMessageId = messageId;
    } else {
        room.pinnedMessageId = null;
    }

    await room.save();
    const populated = await room.populate('pinnedMessageId');

    emitToRoom(room.requestId, 'MESSAGE_PINNED', {
        roomId: room._id.toString(),
        pinnedMessage: populated.pinnedMessageId,
    });

    return populated;
}

export async function toggleCooldown(roomId, requesterId) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError('Coordination room not found', 404);
    if (!room.adminId.equals(requesterId)) throw new AppError('Only the room admin can configure cooldown', 403);

    room.cooldownEnabled = !room.cooldownEnabled;
    await room.save();

    emitToRoom(room.requestId, 'COOLDOWN_UPDATED', {
        cooldownEnabled: room.cooldownEnabled,
        messageCooldownSeconds: room.messageCooldownSeconds,
    });

    return room;
}

export async function updateCooldown(roomId, requesterId, messageCooldownSeconds, cooldownEnabled = null) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError('Coordination room not found', 404);
    if (!room.adminId.equals(requesterId)) throw new AppError('Only the room admin can configure cooldown', 403);

    if (typeof messageCooldownSeconds === 'number') {
        if (messageCooldownSeconds < 1) {
            throw new AppError('Cooldown must be at least 1 second', 400);
        }
        room.messageCooldownSeconds = messageCooldownSeconds;
    }

    if (typeof cooldownEnabled === 'boolean') {
        room.cooldownEnabled = cooldownEnabled;
    }

    await room.save();

    emitToRoom(room.requestId, 'COOLDOWN_UPDATED', {
        cooldownEnabled: room.cooldownEnabled,
        messageCooldownSeconds: room.messageCooldownSeconds,
    });

    return room;
}

export async function closeRoom(roomId, requesterId) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError('Coordination room not found', 404);
    if (!room.adminId.equals(requesterId)) throw new AppError('Only the room admin can close this room', 403);

    room.status = 'CLOSED';
    room.closedAt = new Date();

    await room.save();

    emitToRoom(room.requestId, 'ROOM_CLOSED', {
        roomId: room._id.toString(),
        requestId: room.requestId.toString(),
    });

    return room;
}