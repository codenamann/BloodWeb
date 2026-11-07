import { Router } from "express";
import authenticate from "../../middleware/authenticate.js";
import {
    handleGetRoom,
    handleGetMessages,
    handleSendMessage,
    handleQuickAction,
    handleGetParticipants,
    handlePinMessage,
    handleUpdateCooldown,
    handleCloseRoom,
    handleDeleteMessage
} from "../controllers/coordination.controller.js";

const router = Router();

// Retrieve room metadata (safe get-or-create for authorized participants)
router.get("/:requestId", authenticate, handleGetRoom);

// Get messages history and cooldown status
router.get("/:requestId/messages", authenticate, handleGetMessages);

// Send a user chat message
router.post("/:requestId/messages", authenticate, handleSendMessage);

// Delete a message (Admin or message sender)
router.delete("/:requestId/messages/:messageId", authenticate, handleDeleteMessage);

// Send a donor quick action (marked on way / arrived)
router.post("/:requestId/quick-action", authenticate, handleQuickAction);

// Get participants (requester and active volunteers)
router.get("/:requestId/participants", authenticate, handleGetParticipants);

// Admin: Pin or unpin a message
router.patch("/:requestId/pin", authenticate, handlePinMessage);

// Admin: Configure cooldown settings
router.patch("/:requestId/cooldown", authenticate, handleUpdateCooldown);

// Admin: Close the coordination room
router.patch("/:requestId/close", authenticate, handleCloseRoom);

export default router;
