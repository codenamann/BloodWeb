import asyncHandler from "../../middleware/asyncHandler.js";
import AppError from "../../middleware/appError.js";
import {
    getOrCreateRoomForUser,
    getRoomByRequestId,
    getRoomParticipants,
    pinMessage,
    updateCooldown,
    closeRoom
} from "../../services/room.service.js";
import {
    sendMessage,
    getMessages,
    getRemainingCooldown,
    handleDonorQuickAction,
    sendSystemMessage
} from "../../services/message.service.js";

export const handleGetRoom = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const room = await getOrCreateRoomForUser(requestId, req.user.id);

    res.status(200).json({
        status: "success",
        data: {
            room
        }
    });
});

export const handleGetMessages = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const room = await getRoomByRequestId(requestId, req.user.id);

    const messages = await getMessages(room._id, req.user.id);
    const cooldownRemaining = room.cooldownEnabled
        ? await getRemainingCooldown(req.user.id, room._id, room.messageCooldownSeconds)
        : 0;

    res.status(200).json({
        status: "success",
        data: {
            roomId: room._id,
            messages,
            cooldownRemaining,
            cooldownEnabled: room.cooldownEnabled,
            messageCooldownSeconds: room.messageCooldownSeconds,
            roomStatus: room.status
        }
    });
});

export const handleSendMessage = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const { text, replyTo } = req.body;

    const room = await getRoomByRequestId(requestId, req.user.id);
    const result = await sendMessage(room._id, req.user.id, text, replyTo);

    if (result.type === "COOLDOWN") {
        return res.status(429).json({
            status: "fail",
            code: "COOLDOWN",
            message: `Message cooldown active. Please wait ${result.cooldown}s.`,
            data: {
                cooldownRemaining: result.cooldown
            }
        });
    }

    res.status(201).json({
        status: "success",
        message: "Message sent successfully",
        data: {
            message: result.message
        }
    });
});

export const handleQuickAction = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const action = req.body.action || req.body.event;

    if (!action) {
        throw new AppError("Action is required", 400);
    }

    const room = await getRoomByRequestId(requestId, req.user.id);
    const message = await handleDonorQuickAction(room._id, req.user.id, action);

    res.status(201).json({
        status: "success",
        message: "Quick response sent successfully",
        data: {
            message
        }
    });
});

export const handleGetParticipants = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const participants = await getRoomParticipants(requestId, req.user.id);

    res.status(200).json({
        status: "success",
        data: participants
    });
});

export const handlePinMessage = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const { messageId } = req.body;

    const room = await getRoomByRequestId(requestId, req.user.id);
    const updatedRoom = await pinMessage(room._id, messageId || null, req.user.id);

    res.status(200).json({
        status: "success",
        message: messageId ? "Message pinned successfully" : "Message unpinned successfully",
        data: {
            room: updatedRoom
        }
    });
});

export const handleUpdateCooldown = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;
    const { seconds, enabled } = req.body;

    const room = await getRoomByRequestId(requestId, req.user.id);
    const updatedRoom = await updateCooldown(room._id, req.user.id, seconds, enabled);

    res.status(200).json({
        status: "success",
        message: "Cooldown settings updated successfully",
        data: {
            room: updatedRoom
        }
    });
});

export const handleCloseRoom = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId || req.params.id;

    const room = await getRoomByRequestId(requestId, req.user.id);
    const closedRoom = await closeRoom(room._id, req.user.id);

    try {
        await sendSystemMessage(room._id, 'ROOM_CLOSED');
    } catch {
        // Log or ignore non-critical system message creation failure on room close
    }

    res.status(200).json({
        status: "success",
        message: "Coordination room closed successfully",
        data: {
            room: closedRoom
        }
    });
});
