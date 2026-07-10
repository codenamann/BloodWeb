const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const bloodRequest = require('../models/bloodRequest');
const { getIO } = require('../utils/socket');
const User = require('../models/User');

// POST /api/blood-request
router.post('/blood-request', authenticateToken, async (req, res) => {
  try {
    const { bloodGroup, urgency, location } = req.body;
    const name = req.user.fullName;
    const date = new Date().toISOString().split('T')[0]; // e.g., '2025-05-24'
    if (!bloodGroup || !urgency || !location) {
      return res.status(400).json({ message: 'bloodGroup, urgency, and location are required' });
    }

    const newRequest = new bloodRequest({
      bloodGroup,
      urgency,
      name,
      date,
      location,
      userId: req.user._id,
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();
    const availableDonors = await User.find({
      _id: { $ne: req.user._id },
      bloodGroup: bloodGroup,
      availability: true
    }).select('_id');

    const io = getIO();
    availableDonors.forEach((donor) => {
      io.to(donor._id.toString()).emit('new-blood-request', {
        request: savedRequest
      });
    });
    res.status(201).json({
      message: 'Blood request created successfully',
      data: savedRequest
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating blood request' });
  }
});
// GET /api/request/mine
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const myRequests = await bloodRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(myRequests);
    console.log('My Requests:', myRequests); // Debugging line
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your requests' });
  }
});
// GET /api/request/match
router.get('/match', authenticateToken, async (req, res) => {
  try {
    const userBloodGroup = req.user.bloodGroup;
    if (!userBloodGroup) {
      return res.status(400).json({ message: 'User blood group not set in profile' });
    }

    const matchedRequests = await bloodRequest.find({
      bloodGroup: userBloodGroup,
      userId: { $ne: req.user._id }  // Exclude self
    }).sort({ createdAt: -1 });

    res.json(matchedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch matching requests' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;

  try {
    const request = await bloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this request' });
    }

    await bloodRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/request/:id/accept
router.put('/:id/accept', authenticateToken, async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user._id;

  try {
    const request = await bloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Prevent duplicate accepts
    if (request.pendingAccepts.includes(userId)) {
      return res.status(400).json({ message: 'You have already accepted this request' });
    }

    request.pendingAccepts.push(userId);
    await request.save();

    const donor = await User.findById(userId).select('fullName phone bloodGroup email');
    const requester = await User.findById(request.userId);

    if (!requester) {
      return res.status(404).json({ message: 'Requester user not found' });
    }
    const notification = {
      title: 'Request Accepted',
      message: `${donor.fullName} has accepted your blood request.`,
      details: {
        'Donor Name': donor.fullName,
        'Phone': donor.phone || 'Not Provided',
        'Blood Group': donor.bloodGroup || 'Unknown',
        'Email': donor.email || 'Not Provided',
        'Accepted At': new Date().toLocaleString()
      },
      read: true
    };
    requester.notifications.push(notification);
    await requester.save();
    const io = getIO();
    io.to(requester._id.toString()).emit('notification', notification);
    res.status(200).json({ message: 'Request accepted and requester notified' });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId, 'notifications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send notifications sorted by date (newest first)
    const notifications = user.notifications
      .sort((a, b) => b.date - a.date);

    res.status(200).json({ notifications });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
