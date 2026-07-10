import { VOLUNTEER_STATUSES } from "../VolunteerResponse.model.js";

// Every legal transition for a VolunteerResponse status.
const ALLOWED_TRANSITIONS = {
    PENDING: ['ACCEPTED', 'BACKUP', 'WITHDRAWN'],
    ACCEPTED: ['BACKUP', 'WITHDRAWN'],
    BACKUP: ['ACCEPTED', 'WITHDRAWN'],
    WITHDRAWN: [],
}

/**
 * Validates that a volunteer status transition is permitted.
 *
 * @param {string} from - Current volunteer status
 * @param {string} to   - Desired new status
 * @throws {Error}      - If the transition is illegal
 */
export function validateVolunteerTransition(from, to) {
    if (!VOLUNTEER_STATUSES.includes(from)) {
        throw new Error(`Invalid current volunteer status: ${from}`);
    }
    if (!VOLUNTEER_STATUSES.includes(to)) {
        throw new Error(`Invalid target volunteer status: ${to}`);
    }
    if (from === to) {
        throw new Error(`Volunteer response is already in status: ${to}`);
    }

    const allowed = ALLOWED_TRANSITIONS[from];
    if (!allowed.includes(to)) {
        throw new Error(
            `Illegal volunteer status transition: "${from}" → "${to}". ` +
            `Allowed transitions from "${from}": [${allowed.join(', ') || 'none'}]`
        );
    }
}

/**
 * Returns all valid next statuses from a given volunteer status.
 *
 * @param {string} from
 * @returns {string[]}
 */
export function getAllowedVolunteerTransitions(from) {
    if (!VOLUNTEER_STATUSES.includes(from)) {
        throw new Error(`Invalid current volunteer status: ${from}`);
    }
    return ALLOWED_TRANSITIONS[from] ?? [];
}

/**
 * Returns true if this is a terminal volunteer status.
 *
 * @param {string} status
 * @returns {boolean}
 */
export function isTerminalVolunteerStatus(status) {
    if (!VOLUNTEER_STATUSES.includes(status)) {
        throw new Error(`Invalid volunteer status: ${status}`);
    }
    return ALLOWED_TRANSITIONS[status].length === 0;
}