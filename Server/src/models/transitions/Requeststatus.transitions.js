import { REQUEST_STATUSES } from "../BloodRequest.model.js";

const ALLOWED_TRANSITIONS = {
    PENDING: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED', 'EXPIRED'],
    PARTIALLY_FULFILLED: ['FULFILLED', 'CANCELLED', 'EXPIRED'],
    FULFILLED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    EXPIRED: [],
};


/**
 * Validates that a status transition is permitted.
 *
 * @param {string} from - Current status of the BloodRequest
 * @param {string} to   - Desired new status
 * @throws {Error}      - If the transition is illegal or the status values are invalid
 */
export function validateRequestTransition(from, to) {
    if (!REQUEST_STATUSES.includes(from)) {
        throw new Error(`Invalid current status: ${from}`);
    }
    if (!REQUEST_STATUSES.includes(to)) {
        throw new Error(`Invalid target status: ${to}`);
    }
    if (from === to) {
        throw new Error(`Request is already in status: ${to}`);
    }

    const allowed = ALLOWED_TRANSITIONS[from];
    if (!allowed.includes(to)) {
        throw new Error(
            `Illegal status transition: "${from}" → "${to}". ` +
            `Allowed transitions from "${from}": [${allowed.join(', ') || 'none'}]`
        );
    }
}

/**
 * Returns all valid next statuses from a given status.
 * Used by the API to tell the client what transitions are currently available.
 *
 * @param {string} from - Current status
 * @returns {string[]}
 */
export function getAllowedRequestTransitions(from) {
    if (!REQUEST_STATUSES.includes(from)) {
        throw new Error(`Invalid current status: ${from}`);
    }
    return ALLOWED_TRANSITIONS[from] ?? [];
}

/**
 * Returns true if the status is terminal (no further transitions possible).
 *
 * @param {string} status
 * @returns {boolean}
 */
export function isTerminalRequestStatus(status) {
    if (!REQUEST_STATUSES.includes(status)) {
        throw new Error(`Invalid request status: ${status}`)
    }
    return ALLOWED_TRANSITIONS[status]?.length === 0;
}