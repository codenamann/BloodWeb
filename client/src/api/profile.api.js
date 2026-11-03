import client from "./client";

export async function getUserProfile() {
    const res = await client.get('/api/user/profile');

    return res.data;
}

export async function updateUserLocation(locationData) {
    const res = await client.patch('/api/user/location', locationData);
    return res.data;
}

export async function updatePhone(phone) {
    const res = await client.patch('/api/user/phone', { phone });
    return res.data;
}

export async function updateContactInfo({ name, phone }) {
    const res = await client.patch('/api/user/contact-info', { name, phone });
    return res.data;
}

export async function updateBloodGroup(bloodGroup) {
    const res = await client.patch('/api/user/blood-group', { bloodGroup });
    return res.data;
}

export async function updateDob(dob) {
    const res = await client.patch('/api/user/dob', { dob });
    return res.data;
}

export async function toggleAvailability() {
    const res = await client.patch('/api/user/availability');
    return res.data;
}

export async function updateDonorReadiness({ bloodGroup, location, availability, phone, dob }) {
    const res = await client.patch('/api/user/donor-readiness', { bloodGroup, location, availability, phone, dob });
    return res.data;
}

export async function uploadAvatar(fileBlob) {
    const formData = new FormData();
    formData.append('avatar', fileBlob, 'avatar.webp');
    const res = await client.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteAvatar() {
    const res = await client.delete('/api/user/avatar');
    return res.data;
}