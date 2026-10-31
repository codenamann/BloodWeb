import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { io as ClientIO } from '../client/node_modules/socket.io-client/build/esm/index.js';
import env from './src/config/env.js';
import User from './src/models/User.model.js';
import Hospital from './src/models/Hospital.model.js';
import BloodRequest from './src/models/BloodRequest.model.js';
import VolunteerResponse from './src/models/VolunteerResponse.model.js';
import CoordinationRoom from './src/models/CoordinationRoom.model.js';
import Message from './src/models/Message.model.js';
import Notification from './src/models/Notification.model.js';

import { createRequest, completeRequest, cancelRequest, getRequestById } from './src/services/request.service.js';
import { createVolunteerResponse, updateVolunteerStatus } from './src/services/volunteer.service.js';
import { getRoomParticipants } from './src/services/room.service.js';
import { handleDonorQuickAction, getMessages } from './src/services/message.service.js';
import { getNotifications } from './src/services/notification.service.js';

async function runLifecycleLoop() {
    console.log('=== BLOODWEB MASTER LIFECYCLE VERIFICATION LOOP ===\n');

    await mongoose.connect(env.db.uri);
    console.log('[1/12] Connected to MongoDB');

    // 1. Setup Requester, Donor, and Hospital
    let requester = await User.findOne({ email: 'namantiwari.dev@gmail.com' });
    let donor = await User.findOne({ email: 'testuser99@bloodweb.com' });
    let hospital = await Hospital.findOne();

    if (!requester || !donor || !hospital) {
        throw new Error('Required test fixtures (requester/donor/hospital) not found in DB');
    }

    if (!donor.phone) {
        donor.phone = '+15551234567';
        await donor.save();
    }
    if (!requester.phone) {
        requester.phone = '+15559876543';
        await requester.save();
    }

    const requesterId = requester._id.toString();
    const donorId = donor._id.toString();
    console.log(`[2/12] Test fixtures ready: Requester=${requester.name}, Donor=${donor.name}, Hospital=${hospital.name}`);

    // Record donor baseline donations
    const initialDonations = donor.successfulDonations || 0;

    // 2. Requester creates request
    const requestDoc = await createRequest({
        patientBloodGroup: 'O+',
        unitsNeeded: 1,
        hospitalId: hospital._id.toString(),
        urgency: 'HIGH',
        neededBy: new Date(Date.now() + 2 * 3600 * 1000),
        patientCondition: 'Emergency Trauma Surgery',
        hospitalDocument: {
            url: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
            storageKey: 'bloodweb_docs/sample_doc_123',
            originalName: 'hospital_admission.pdf',
            mimeType: 'application/pdf',
            documentType: 'PDF',
            size: 1048576
        }
    }, requesterId);
    const requestId = requestDoc._id.toString();
    console.log(`[3/12] BloodRequest created: ID=${requestId}, status=${requestDoc.status}`);

    // 3. Privacy check on new request (before volunteer response)
    const requestBeforeVol = await getRequestById(requestId, donorId);
    if (requestBeforeVol.createdBy.phone || requestBeforeVol.createdBy.email) {
        throw new Error('FAILED: Requester contact leaked to unaccepted viewer before response!');
    }
    console.log('[4/12] PASS: Requester contact privacy enforced before volunteer acceptance.');

    // 4. Donor volunteers
    const volunteer = await createVolunteerResponse(requestId, donorId, { lat: 40.7128, lng: -74.006 });
    console.log(`[5/12] Volunteer response created: ID=${volunteer._id}, status=${volunteer.status}, distance=${volunteer.estimatedDistanceKm}km`);

    // Verify raw GPS coordinates are NOT leaked in getRequestById
    const requestAfterVol = await getRequestById(requestId, requesterId);
    const volSummary = requestAfterVol.responses[0];
    if (volSummary.locationAtResponse) {
        throw new Error('FAILED: Raw GPS coordinates leaked in request response summary!');
    }
    if (volSummary.donor.phone || volSummary.donor.email) {
        throw new Error('FAILED: Donor contact leaked to requester while volunteer is still PENDING!');
    }
    console.log('[6/12] PASS: Donor contact and raw GPS privacy enforced while volunteer is PENDING.');

    // 5. In-app notification received by Requester
    const requesterNotifs = await getNotifications(requesterId);
    const volNotif = requesterNotifs.find(n => n.redirectUrl?.includes(requestId));
    if (!volNotif || !volNotif.title.includes('Volunteer')) {
        throw new Error('FAILED: Requester did not receive in-app notification on volunteer response!');
    }
    console.log(`[7/12] PASS: Requester received in-app notification: "${volNotif.title}"`);

    // 6. Requester accepts the volunteer
    await updateVolunteerStatus(volunteer._id.toString(), requesterId, 'ACCEPTED');
    console.log('[8/12] Volunteer promoted to ACCEPTED by requester');

    // 7. Mutual Trust Boundary Check (after ACCEPTED)
    const reqDetailsAfterAccept = await getRequestById(requestId, donorId);
    if (!reqDetailsAfterAccept.createdBy.phone) {
        throw new Error('FAILED: Requester phone should be visible to ACCEPTED donor!');
    }
    const donorDetailsAfterAccept = await getRequestById(requestId, requesterId);
    if (!donorDetailsAfterAccept.responses[0].donor.phone) {
        throw new Error('FAILED: Accepted donor phone should be visible to requester!');
    }
    console.log('[9/12] PASS: Mutual contact information correctly accessible after volunteer ACCEPTANCE.');

    // 8. Donor performs quick action in Coordination Room
    const room = await CoordinationRoom.findOne({ requestId });
    if (!room) throw new Error('FAILED: Coordination room not created for accepted request');
    await handleDonorQuickAction(room._id, donorId, 'MARKED_ON_WAY');
    const roomMessages = await getMessages(room._id, donorId);
    const onWayMsg = roomMessages.find(m => m.event === 'MARKED_ON_WAY');
    if (!onWayMsg) throw new Error('FAILED: Quick action message not recorded in room!');
    console.log(`[10/12] PASS: Donor quick action recorded in coordination room: "${onWayMsg.text}"`);

    // 9. Requester completes request
    const completed = await completeRequest(requestId, requesterId);
    if (completed.status !== 'COMPLETED') {
        throw new Error(`FAILED: Request status is ${completed.status}, expected COMPLETED`);
    }

    // Verify donor credit
    const updatedDonor = await User.findById(donorId);
    if (updatedDonor.successfulDonations !== initialDonations + 1) {
        throw new Error(`FAILED: Donor successfulDonations expected ${initialDonations + 1}, got ${updatedDonor.successfulDonations}`);
    }

    // Verify room closed
    const updatedRoom = await CoordinationRoom.findOne({ requestId });
    if (updatedRoom.status !== 'CLOSED') {
        throw new Error(`FAILED: Room status expected CLOSED, got ${updatedRoom.status}`);
    }
    console.log(`[11/12] PASS: completeRequest succeeded! Donor donations=${updatedDonor.successfulDonations}, Room=CLOSED`);

    // 10. Verify Socket.IO authentication and connection
    const requesterToken = jwt.sign(
        { id: requester._id.toString(), email: requester.email },
        env.auth.jwtSecret,
        { expiresIn: '1h' }
    );

    const clientSocket = ClientIO('http://localhost:5000', {
        auth: { token: requesterToken },
        transports: ['websocket'],
    });

    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Socket connection timed out')), 5000);
        clientSocket.on('connect', () => {
            clearTimeout(timeout);
            console.log(`[12/12] PASS: Socket.IO connected with authenticated user socket ID: ${clientSocket.id}`);
            clientSocket.disconnect();
            resolve();
        });
        clientSocket.on('connect_error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });

    // Cleanup test request & volunteer response
    await Promise.all([
        BloodRequest.deleteOne({ _id: requestId }),
        VolunteerResponse.deleteMany({ requestId }),
        CoordinationRoom.deleteOne({ requestId }),
        Message.deleteMany({ roomId: room._id }),
        Notification.deleteMany({ redirectUrl: { $regex: requestId } }),
        User.updateOne({ _id: donorId }, { $set: { successfulDonations: initialDonations } }),
    ]);

    await mongoose.disconnect();
    console.log('\n>>> ALL 12 LIFECYCLE PHASES PASSED WITH ZERO FAILURES! <<<');
}

runLifecycleLoop().catch((err) => {
    console.error('LIFECYCLE TEST FAILED:', err);
    process.exit(1);
});
