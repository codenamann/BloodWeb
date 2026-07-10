import mongoose from "mongoose";

export const HOSPITAL_SOURCES = ['OSM', 'MANUAL'];

const coordinatesSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
    /* osmId is null for MANUAL entries. Unique constaint uses sparse so that multiple
    MANUAL entries (all Null) don't violate uniqueness */
    osmId: {
        type: String,
        unique: true,
        sparse: true,
        default: null,
    },

    name: {
        type: String,
        required: [true, "Hospital name is required"],
        trim: true,
    },

    address: {
        type: String,
        required: [true, "Hospital address is required"],
        trim: true,
    },

    city: {
        type: String,
        required: [true, "Hospital city is required"],
        trim: true,
        lowercase: true,
    },

    state: {
        type: String,
        required: [true, "Hospital state is required"],
        trim: true,
        lowercase: true,
    },

    // Required for OSM entries (Overpass API always returns coordinates).
    // Optional for MANUAL entries where requester may not know exact coords.
    coordinates: {
        type: coordinatesSchema,
        default: null,
    },

    source: {
        type: String,
        enum: {
            values: HOSPITAL_SOURCES,
            message: "Hospital source must be OSM or MANUAL",
        },
        required: [true, "Hospital source is required"],
    },

    // OSM entries are trusted by default.
    // MANUAL entries are unverified until admin reviews them.

    verified: {
        type: Boolean,
        required: [true, "Hospital verification status is required"],
        default: false,
    }
},
    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Primary deduplication guard. Sparse allows multiple null osmIds (MANUAL entries).
hospitalSchema.index({ osmId: 1 }, { unique: true, sparse: true });

// Autocomplete queries always filter by city. This is the primary lookup path. 
hospitalSchema.index({ city: 1 });

// filter unverified MANUAL submissions for review.
hospitalSchema.index({ source: 1, verified: 1 });

// text search for hospital name autocomplete within a city.
hospitalSchema.index({ name: "text" });

// ─── Statics ──────────────────────────────────────────────────────────────────

// Find or create by osmId. Prevents duplicates when the same hospital is
// searched by two different requesters before the first result is cached.
hospitalSchema.statics.findOrCreateByOsmId = async function (data) {
    const existing = await this.findOne({ osmId: data.osmId });
    if (existing) return existing;
    return this.create(data);
}

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;