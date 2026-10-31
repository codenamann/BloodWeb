import { Router } from "express";
import authenticate from "../../middleware/authenticate.js";
import {
    handleCreateVolunteerResponse,
    handleUpdateVolunteerStatus,
    handleWithdrawVolunteer,
    handleGetVolunteersForRequest
} from "../controllers/volunteer.controller.js";

const router = Router();

// Submit a volunteer response for a blood request
router.post("/:id", authenticate, handleCreateVolunteerResponse);

// Update volunteer status (accepted / backup) by request creator
router.patch("/:id/status", authenticate, handleUpdateVolunteerStatus);

// Withdraw response by the volunteer donor
router.patch("/:id/withdraw", authenticate, handleWithdrawVolunteer);

// Get all volunteers for a blood request
router.get("/request/:id", authenticate, handleGetVolunteersForRequest);

export default router;
