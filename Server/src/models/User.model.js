import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const ACCOUNT_STATUSES = ['ACTIVE', 'SUSPENDED', 'DELETED'];

// Embedded sub-schema. _id: false because this not a standalone document.
const coordinatesSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

// location is stored as a sub-document, not a ref.
// Null until the user attempts an action that requires it (volunteer / enable availability).
const locationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, lowercase: true },
    area: { type: String, required: true, trim: true },

    // Optional yet recommended for better location accuracy.
    coordinates: {
      type: coordinatesSchema,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false, // Exclude from query results by default
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: '{VALUE} is not a valid blood group',
      },
      default: null,
    },

    location: {
      type: locationSchema,
      default: null,
    },

    // ── Availability ──────────────────────────────────────────────────────────
    // Only users with availability: true appear in matching queries.
    // Requires bloodGroup and location to be set before it can be toggled true.
    availability: {
      type: Boolean,
      default: false,
    },

    // ── Reliability tracking ──────────────────────────────────────────────────
    // Incremented every time a VolunteerResponse is submitted.
    totalVolunteers: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Incremented when a VolunteerResponse with status ACCEPTED reaches
    // a request that is marked COMPLETED.
    successfulDonations: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Account state ─────────────────────────────────────────────────────────
    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUSES,
        message: 'Invalid account status',
      },
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────

// Derived — never stored. True when all fields required for full platform
// participation are set.
userSchema.virtual('profileComplete').get(function () {
  return !!(
    this.bloodGroup &&
    this.location &&
    this.location.city &&
    this.location.area
  );
});


// Derived — never stored. successfulDonations / totalVolunteers.
// 0 when no volunteers yet to avoid division by zero.
userSchema.virtual('reliabilityScore').get(function () {
  if (!this.totalVolunteers) return 0;
  return this.successfulDonations / this.totalVolunteers;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Every matching query filters by availability first.
userSchema.index({ availability: 1 });

// matching also filters by bloodGroup and city.
userSchema.index({ 'location.city': 1, availability: 1 });
userSchema.index({ bloodGroup: 1, availability: 1 });

// compound index for full matching query path.
userSchema.index({ bloodGroup: 1, 'location.city': 1, availability: 1, accountStatus: 1 });

// admin lookup by account status.
userSchema.index({ accountStatus: 1 });

// unique index on email
userSchema.index({ email: 1 }, { unique: true });

// ─── Pre-save hooks ───────────────────────────────────────────────────────────

// Hash password before saving. Only runs when passwordHash is modified.
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// If availability is being set to true, enforce that bloodGroup and location
// are already set. This is a data integrity guard at the model level.
userSchema.pre('save', function (next) {
  if (this.availability === true && (!this.bloodGroup || !this.location)) {
    return next(
      new Error('bloodGroup and location must be set before enabling availability')
    );
  }
  next();
});

// ─── Instance methods ─────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (candidatePassword) {
  // passwordHash is select: false - caller must explicitly select it before calling this.
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;