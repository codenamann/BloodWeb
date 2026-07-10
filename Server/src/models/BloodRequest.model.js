import mongoose from "mongoose";
import { BLOOD_GROUPS } from "./User.model.js";

export const REQUEST_STATUSES = [
    "PENDING",
    "ACTIVE",
    "PARTIALLY_FULFILLED",
    "FULFILLED",
    "COMPLETED",
    "CANCELLED",
    "EXPIRED"
];

export const URGENCY_LEVELS = ["NORMAL", "HIGH", "CRITICAL"];

const bloodRequestSchema = new mongoose.Schema(
    {
        // ── Core medical fact ─────────────────────────────────────────────────────
        // Stores the PATIENT'S blood group — a fact the requester knows.
        // Compatible DONOR groups are derived by CompatibilityEngine, never stored here.
        patientBloodGroup: {
            type: String,
            enum: {
                values: BLOOD_GROUPS,
                message: "{VALUE} is not a valid blood group",
            },
            required: [true, "Patient blood group is required"],
        },

        unitsNeeded: {
            type: Number,
            required: [true, "Units needed is required"],
            min: [1, "Atleast 1 unit must be requested"],
            validate: {
                validator: Number.isInteger,
                message: "Units needed must be an integer",
            },
        },

        // ── Location ──────────────────────────────────────────────────────────────
        // Blood requests are tied to a hospital, not a personal address.
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: [true, "Hospital ID is required"],
        },

        // ── Urgency & timing ──────────────────────────────────────────────────────
        urgency: {
            type: String,
            enum: {
                values: URGENCY_LEVELS,
                message: "Urgency must be NORMAL, HIGH, or CRITICAL",
            },
            required: [true, "Urgency level is required"],
            default: "NORMAL",
        },

        // Optional surgery deadline or "needed before" time.
        // null means "as soon as possible".
        neededBy: {
            type: Date,
            default: null,
        },

        // ── Status ────────────────────────────────────────────────────────────────
        // Never update this field directly with a raw DB write.
        // All transitions must go through requestStatus.transitions.js.
        status: {
            type: String,
            enum: {
                values: REQUEST_STATUSES,
                message: 'Invalid request status',
            },
            default: 'PENDING',
            required: [true, 'Request status is required'],
        },


        // ── Legitimacy ────────────────────────────────────────────────────────────
        // Optional hospital document (doctor's note, prescription, admission slip).
        // Uploaded by requester. Stored as a URL to cloud storage.
        // Visible to all room participants to reduce fake requests.
        hospitalDocument: {
            type: String, // file URL
            default: null,
        },

        // ── Ownership ─────────────────────────────────────────────────────────────
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Request must have a creator'],
        }
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Common query: find ACTIVE requests for a given hospital
bloodRequestSchema.index({ hospitalId: 1, status: 1 })

// Admin & Dashboard: requests by status.
bloodRequestSchema.index({ status: 1 });

// User's own request history
bloodRequestSchema.index({ createdBy: 1, status: 1 });

// Urgency based sorting
bloodRequestSchema.index({ urgency: 1, status: 1 });

// Expiry job: find ACTIVE/FULFILLED requests whose neededBy has passed.
// Sparse because most requests have neededBy: null.
bloodRequestSchema.index({ neededBy: 1 }, { sparse: true });

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;