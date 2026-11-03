import * as userService from '../../services/user.service.js';

export async function getUserProfile(req, res) {
    const userId = req.user?.id || req.user?._id;
    const user = await userService.getUserProfile(userId);

    res.status(200).json({
        status: 'success',
        message: 'User profile fetched successfully',
        data: {
            user
        }
    });
}

export async function updateLocation(req, res) {
    const userId = req.user?.id || req.user?._id;
    const locationData = req.body.location || req.body;

    const location = await userService.updateLocation(userId, locationData);

    res.status(200).json({
        status: 'success',
        message: 'Location updated successfully',
        data: {
            location
        }
    });
}

export async function updatePhone(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { phone } = req.body;

    const user = await userService.updatePhone(userId, phone);

    res.status(200).json({
        status: 'success',
        message: 'Phone updated successfully',
        data: {
            user
        }
    });
}

export async function updateContactInfo(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { name, phone } = req.body;

    const user = await userService.updateContactInfo(userId, { name, phone });

    res.status(200).json({
        status: 'success',
        message: 'Contact information updated successfully',
        data: {
            user
        }
    });
}

export async function updateBloodGroup(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { bloodGroup } = req.body;

    const user = await userService.updateBloodGroup(userId, bloodGroup);

    res.status(200).json({
        status: 'success',
        message: 'Blood group updated successfully',
        data: {
            user
        }
    });
}

export async function updateDob(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { dob } = req.body;

    const user = await userService.updateDob(userId, dob);

    res.status(200).json({
        status: 'success',
        message: 'Date of birth update request processed',
        data: {
            user
        }
    });
}

export async function toggleAvailability(req, res) {
    const userId = req.user?.id || req.user?._id;
    const user = await userService.toggleAvailability(userId);

    res.status(200).json({
        status: 'success',
        message: 'Availability toggled successfully',
        data: {
            availability: user.availability,
            user
        }
    });
}

export async function updateDonorReadiness(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { bloodGroup, location, availability, phone, dob } = req.body;

    const user = await userService.updateDonorReadiness(userId, {
        bloodGroup,
        location,
        availability,
        phone,
        dob
    });

    res.status(200).json({
        status: 'success',
        message: 'Donor readiness updated successfully',
        data: {
            user
        }
    });
}

export async function uploadAvatar(req, res) {
    const userId = req.user?.id || req.user?._id;
    const user = await userService.updateAvatar(userId, req.file);

    res.status(200).json({
        status: 'success',
        message: 'Avatar uploaded successfully',
        data: {
            user,
            avatar: user?.avatar || null
        }
    });
}

export async function removeAvatar(req, res) {
    const userId = req.user?.id || req.user?._id;
    const user = await userService.removeAvatar(userId);

    res.status(200).json({
        status: 'success',
        message: 'Avatar removed successfully',
        data: {
            user,
            avatar: null
        }
    });
}