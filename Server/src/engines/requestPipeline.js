import BloodRequest from "../models/BloodRequest.model.js";
import { validateRequestTransition } from "../models/transitions/requestStatus.transitions.js";
import { getMatchingDonors } from "./matchingEngine.js";

export async function requestPipeline(request) {
    validateRequestTransition(request.status, 'ACTIVE');

    const { patientBloodGroup, hospitalId, createdBy } = request;
    const matchingDonors = await getMatchingDonors(patientBloodGroup, hospitalId, createdBy);

    // TODO: notifyDonors(matchingDonors);

    await BloodRequest.updateOne(
        { _id: request._id },
        { $set: { status: 'ACTIVE' } }
    );
}