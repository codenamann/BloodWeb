import mongoose from "mongoose";
import BloodRequest from "../models/BloodRequest.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import Message from "../models/Message.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";
import User from "../models/User.model.js";
import AppError from "../middleware/appError.js";
import { emitToRoom } from "../utils/socket.js";

export async function isRoomParticipant(requestId, senderId) {
    if (!requestId || !senderId) return false;

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

export async function sendMessage(roomId, senderId, text, replyTo = null) {
    if (!text || typeof text !== 'string' || !text.trim()) {
        throw new AppError("Message text is required", 400);
    }

    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError("Coordination room not found", 404);
    if (room.status !== 'ACTIVE') throw new AppError("Coordination room is closed", 400);

    const isParticipant = await isRoomParticipant(room.requestId, senderId);
    if (!isParticipant) throw new AppError('You are not a participant of this room', 403);

    const isAdmin = room.adminId.equals(senderId);

    if (!isAdmin && room.cooldownEnabled) {
        const cooldown = await getRemainingCooldown(senderId, roomId, room.messageCooldownSeconds);
        if (cooldown > 0) {
            return {
                type: "COOLDOWN",
                cooldown
            };
        }
    }

    const messageData = {
        roomId,
        senderId,
        type: 'USER',
        text: text.trim()
    };

    if (replyTo && (replyTo.text || replyTo.messageId)) {
        messageData.replyTo = {
            messageId: replyTo.messageId || null,
            senderName: replyTo.senderName || null,
            text: replyTo.text ? String(replyTo.text).slice(0, 300) : null
        };
    }

    const message = await Message.create(messageData);
    await message.populate('senderId', 'name avatar bloodGroup');

    // Broadcast message to all active participants in the coordination room
    emitToRoom(room.requestId, 'NEW_MESSAGE', message);

    return {
        type: "MESSAGE",
        message
    };
}

export async function getRemainingCooldown(senderId, roomId, messageCooldownSeconds) {
    const lastMessage = await Message.findOne(
        {
            senderId,
            roomId,
            type: 'USER'
        },
        { createdAt: 1 }
    ).sort({ createdAt: -1 }).lean();

    if (!lastMessage) return 0;

    const cooldownMs = (messageCooldownSeconds || 3) * 1000;
    const elapsedMs = Date.now() - new Date(lastMessage.createdAt).getTime();
    const remainingSeconds = Math.ceil(Math.max(0, cooldownMs - elapsedMs) / 1000);

    return remainingSeconds;
}

export async function sendSystemMessage(roomId, event, customText = null) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError("Coordination room not found", 404);

    const defaultTexts = {
        VOLUNTEER_JOINED: "A new donor has volunteered for this request.",
        VOLUNTEER_ACCEPTED: "A volunteer donor has been accepted for this request.",
        VOLUNTEER_BACKUP: "A volunteer donor has been placed as backup.",
        VOLUNTEER_WITHDRAWN: "A volunteer has withdrawn from this request.",
        MARKED_ON_WAY: "A volunteer is en route to the hospital.",
        DISTANCE_UPDATED: "A volunteer has arrived at the hospital blood bank desk.",
        REQUEST_FULFILLED: "The blood request has been fulfilled.",
        REQUEST_COMPLETED: "The blood request has been marked as completed.",
        ROOM_CLOSED: "The coordination room has been closed by the coordinator."
    };

    const text = (customText && customText.trim()) || defaultTexts[event] || `System notification: ${event}`;

    const message = await Message.create({
        roomId,
        senderId: null,
        type: 'SYSTEM',
        event,
        text
    });

    emitToRoom(room.requestId, 'NEW_MESSAGE', message);

    return message;
}

export async function handleDonorQuickAction(roomId, donorId, action) {
    const room = await CoordinationRoom.findById(roomId);
    if (!room) throw new AppError("Coordination room not found", 404);
    if (room.status !== 'ACTIVE') throw new AppError("Coordination room is closed", 400);

    const isVolunteer = await VolunteerResponse.exists({
        requestId: room.requestId,
        donorId,
        status: { $ne: 'WITHDRAWN' }
    });
    if (!isVolunteer) throw new AppError("Only active volunteers can perform this action", 403);

    const donor = await User.findById(donorId, 'name');
    const donorName = donor?.name || 'A volunteer donor';

    let event;
    let text;

    if (action === 'MARKED_ON_WAY') {
        event = 'MARKED_ON_WAY';
        text = `🚗 ${donorName} is on the way to the hospital.`;
    } else if (action === 'DISTANCE_UPDATED') {
        event = 'DISTANCE_UPDATED';
        text = `🏥 ${donorName} has arrived at the hospital blood bank desk.`;
    } else {
        throw new AppError("Invalid quick action", 400);
    }

    const sysMsg = await sendSystemMessage(roomId, event, text);

    emitToRoom(room.requestId, 'DONOR_QUICK_ACTION', {
        action,
        donorId: donorId.toString(),
        message: sysMsg,
    });

    return sysMsg;
}

export async function getMessages(roomId, senderId) {
    const room = await CoordinationRoom.findById(roomId).lean();
    if (!room) throw new AppError("Coordination room not found", 404);

    const isParticipant = await isRoomParticipant(room.requestId, senderId);
    if (!isParticipant) throw new AppError("You are not authorized to view messages in this room", 403);

    return Message.find({ roomId })
        .populate('senderId', 'name avatar bloodGroup')
        .sort({ createdAt: 1 })
        .lean();
}