import BloodRequest from "../models/BloodRequest.model.js";
import { validateRequestTransition } from "../models/transitions/requestStatus.transitions.js";
import { notifyDonors } from "../services/notification.service.js";
import { getMatchingDonors } from "./matchingEngine.js";
import logger from "../utils/logger.js";

export async function requestPipeline(request) {
    try {
        logger.info(`[PIPELINE] Starting request pipeline for request ${request._id}`);
        validateRequestTransition(request.status, 'ACTIVE');

        const { patientBloodGroup, hospitalId, createdBy } = request;
        const matchingDonors = await getMatchingDonors(patientBloodGroup, hospitalId._id || hospitalId, createdBy._id || createdBy);

        logger.info(`[PIPELINE] Found ${matchingDonors.length} matching donors`);

        await notifyDonors(matchingDonors, request);
        logger.info(`[PIPELINE] Notified donors`);

        await BloodRequest.updateOne(
            { _id: request._id },
            { $set: { status: 'ACTIVE' } }
        );
        logger.info(`[PIPELINE] Pipeline finished. Status set to ACTIVE`);
    } catch (err) {
        logger.error(`[PIPELINE ERROR] Pipeline failed: ${err.message}`, { error: err });
        throw err;
    }
}