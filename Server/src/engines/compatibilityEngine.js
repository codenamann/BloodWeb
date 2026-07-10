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
    if (!donorCompatibility[bloodType]) {
        throw new Error(`Invalid blood type: ${bloodType}`);
    }

    return donorCompatibility[bloodType];
}