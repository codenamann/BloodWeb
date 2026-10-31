export const donorCompatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

export function getCompatibleDonorGroups(bloodGroup) {
    if (!donorCompatibility[bloodGroup]) {
        throw new Error(`Invalid blood type: ${bloodGroup}`);
    }

    return donorCompatibility[bloodGroup];
}

export function getCompatibleRecipientGroups(donorBloodGroup) {
    if (!donorBloodGroup || !donorCompatibility[donorBloodGroup]) {
        return Object.keys(donorCompatibility);
    }
    return Object.keys(donorCompatibility).filter((patientGroup) =>
        donorCompatibility[patientGroup]?.includes(donorBloodGroup)
    );
}