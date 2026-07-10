import mongoose from "mongoose";

export const VOLUNTEER_STATUSES = [
    'PENDING',
    'ACCEPTED',
    'BACKUP',
    'WITHDRAWN',
]

// Captured at the moment the donor volunteers — not their profile location.
// Used to calculate estimated distance and ETA to the hospital.
// This is intentionally separate from User.location (profile location).
const locationAtResponseSchema = new mongoose.Schema(
    {
        lat: {
            type: Number,
            required: [true, "Latitude is required"],
        },
        lng: {
            type: Number,
            required: [true, "Longitude is required"],
        },
    },
    { _id: false }
);

const volunteerResponseSchema = new mongoose.Schema(
    {
        // References
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodRequest",
            required: [true, "Blood request ID is required"],
        },

        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Donor ID is required"],
        },

        // Status
        status: {
            type: String,
            enum: {
                values: VOLUNTEER_STATUSES,
                message: "{VALUE} is not a valid volunteer status",
            },
            default: "PENDING",
            required: true,
        },

        // Location at time of Volunteering
        locationAtResponse: {
            type: locationAtResponseSchema,
            required: [true, "Location at time of volunteering is required"],
        },

        // Estimated distance and ETA to the hospital at the time of volunteering
        // time using locationAtResponse vs hospital coordinates.
        // Used by the CoordinationRoom to sort volunteers by proximity.
        estimatedDistanceKm: {
            type: Number,
            min: [0, "Estimated distance cannot be negative"],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes

// Primary query: all responses for a given request ( room participants and fulfillment check )
volunteerResponseSchema.index({ requestId: 1 });

// Fulfillment calculation: count accepted responses for a request.
volunteerResponseSchema.index({ requestId: 1, status: 1 });

// Prevent a donor from volunteering for the same request twice.
volunteerResponseSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

// Donor's own history.
volunteerResponseSchema.index({ donorId: 1 });

// Pre-Save Hooks

// Increment User.totalVolunteers when a new VolunteerResponse is created.
// Using post(''save') instead of pre('save') to ensure the VolunteerResponse is successfully saved before updating the User.

volunteerResponseSchema.post('save', async function (doc) {
    if (this.wasNew) {
        const { default: User } = await import('./User.model.js');
        await User.findByIdAndUpdate(doc.donorId,
            {
                $inc: { totalVolunteers: 1 }
            }
        );
    }
});

// Track whether this is a new document (isNew is false by the time post('save') fires).
volunteerResponseSchema.pre('save', function (next) {
    this.wasNew = this.isNew; // capture before save flips it
    next();
});

const VolunteerResponse = mongoose.model("VolunteerResponse", volunteerResponseSchema);

export default VolunteerResponse;