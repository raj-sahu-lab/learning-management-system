const logService = require('../../../services/V1/Student/Log.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


module.exports.addUpdateVideoLog = async function (req, res) {

    const body = req.fields;
    if (!body.videoId) {

        return ReE(res, 'Video id missing.', 422);

    } else if (body.duration == null) {

        return ReE(res, 'Video duration missing.', 422);

    } else {

        [err, videoLog] = await to(logService.getVideoLog(body.videoId , req.user.id));
        
        if (videoLog) {

            const updateJSON = { seenDuration: body.duration, update_ip: req.ip };
            [err, videoLog] = await to(logService.updateVideoLog(updateJSON, videoLog.id));
            if (err) return ReE(res, err, 422);
            if (videoLog.length > 0 && videoLog[0] == 1) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);

            }

        } else {

            const logJSON = { videoId: body.videoId, studentId: req.user.id, seenDuration: body.duration, create_ip: req.ip };
            [err, videoLog] = await to(logService.addVideoLog(logJSON));
            if (err) return ReE(res, err, 422);
            if (videoLog) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);
            }
        }
    }

}


module.exports.addUpdateAudioLog = async function (req, res) {

    const body = req.fields;
    if (!body.audioId) {

        return ReE(res, 'Audio id missing.', 422);

    } else if (body.duration == null) {

        return ReE(res, 'Audio duration missing.', 422);

    } else {

        [err, audioLog] = await to(logService.getAudioLog(body.audioId , req.user.id));
        
        if (audioLog) {

            const updateJSON = { seenDuration: body.duration, update_ip: req.ip };
            [err, audioLog] = await to(logService.updateAudioLog(updateJSON, audioLog.id));
            if (err) return ReE(res, err, 422);
            if (audioLog.length > 0 && audioLog[0] == 1) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);

            }

        } else {

            const logJSON = { audioId: body.audioId, studentId: req.user.id, seenDuration: body.duration, create_ip: req.ip };
            [err, audioLog] = await to(logService.addAudioLog(logJSON));
            if (err) return ReE(res, err, 422);
            if (audioLog) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);
            }
        }
    }

}

module.exports.addUpdatePDFLog = async function (req, res) {

    const body = req.fields;
    if (!body.pdfId) {

        return ReE(res, 'PDF id missing.', 422);

    } else if (body.duration == null) {

        return ReE(res, 'PDF duration missing.', 422);

    } else {

        [err, pdfLog] = await to(logService.getPDFLog(body.pdfId , req.user.id));
        
        if (pdfLog) {

            const updateJSON = { seenDuration: body.duration, update_ip: req.ip };
            [err, pdfLog] = await to(logService.updatePDFLog(updateJSON, pdfLog.id));
            if (err) return ReE(res, err, 422);
            if (pdfLog.length > 0 && pdfLog[0] == 1) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);

            }

        } else {

            const logJSON = { pdfId: body.pdfId, studentId: req.user.id, seenDuration: body.duration, create_ip: req.ip };
            [err, pdfLog] = await to(logService.addPDFLog(logJSON));
            if (err) return ReE(res, err, 422);
            if (pdfLog) {

                return ReS(res, 'Log update successfully.');

            } else {

                return ReE(res, 'Failed to log.', 422);
            }
        }
    }

}