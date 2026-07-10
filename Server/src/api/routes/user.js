const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');

// GET dashboard data (full user info except password)
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data.' });
  }
});

// GET profile info (selected fields)
router.get('/profile', authenticateToken, (req, res) => {
  const { fullName, age, gender, location, _id } = req.user;
  res.json({ fullName, age, gender, location, _id });
});

// GET blood details
router.get('/blood-details', authenticateToken, (req, res) => {
  const { bloodGroup, donorStatus, lastDonation, availability } = req.user;
  res.json({ bloodGroup, donorStatus, lastDonation, availability });
});

// GET emergency contact info
router.get('/emergency', authenticateToken, (req, res) => {
  const { emergencyAvailability, phone, email } = req.user;
  res.json({ emergencyAvailability, phone, email });
});

router.get('/profile/check-completion', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('age gender location phone bloodGroup');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const requiredFields = ['age', 'gender', 'location', 'phone', 'bloodGroup'];
    const missingFields = requiredFields.filter(field => !user[field]);

    res.json({ missingFields });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/availability', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { availability } = req.body;
    console.log('Availability:', availability); // Debugging line
    if (availability === undefined) return res.status(400).send('Availability missing');

    await User.findByIdAndUpdate(userId, { availability });
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PATCH /api/user/emergency-status
router.patch('/emergency', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emergencyAvailability } = req.body;
    if (emergencyAvailability === undefined) return res.status(400).send('Emergency status missing');

    await User.findByIdAndUpdate(userId, { emergencyAvailability });
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.patch('/update-profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body; // Expect partial user fields, e.g. { age: 25, location: "NYC" }

    // Update the authenticated user's document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: '-password'
    });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;
