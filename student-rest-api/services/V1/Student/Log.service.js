const { TOA_video_log , TOA_audio_log , TOA_pdf_log } = require('../../../models');
const { to, TE } = require('../util.service');


// ==================== Video Log ====================
module.exports.getVideoLog = async function (videoId, studentId) {

    [err, videoLog] = await to(TOA_video_log.findOne({ where: { studentId: studentId, videoId: videoId } }));
    if (err) TE(err.message);
    return videoLog;
}


module.exports.addVideoLog = async function (logJSON) {

    [err, videoLog] = await to(TOA_video_log.create(logJSON));
    if (err) TE(err.message);
    return videoLog;
}

module.exports.updateVideoLog = async function (logJSON, logId) {

    [err, videoLog] = await to(TOA_video_log.update(logJSON, { where: { id: logId } }));
    if (err) TE(err.message);
    return videoLog;
}

// ==================== Video Log ====================

// ==================== Audio Log ====================
module.exports.getAudioLog = async function (audioId, studentId) {

    [err, audioLog] = await to(TOA_audio_log.findOne({ where: { studentId: studentId, audioId: audioId } }));
    if (err) TE(err.message);
    return audioLog;
}


module.exports.addAudioLog = async function (logJSON) {

    [err, audioLog] = await to(TOA_audio_log.create(logJSON));
    if (err) TE(err.message);
    return audioLog;
}

module.exports.updateAudioLog = async function (logJSON, logId) {

    [err, audioLog] = await to(TOA_audio_log.update(logJSON, { where: { id: logId } }));
    if (err) TE(err.message);
    return audioLog;
}

// ==================== Audio Log ====================


// ==================== PDF Log ====================
module.exports.getPDFLog = async function (pdfId, studentId) {

    [err, pdfLog] = await to(TOA_pdf_log.findOne({ where: { studentId: studentId, pdfId: pdfId } }));
    if (err) TE(err.message);
    return pdfLog;
}


module.exports.addPDFLog = async function (logJSON) {

    [err, pdfLog] = await to(TOA_pdf_log.create(logJSON));
    if (err) TE(err.message);
    return pdfLog;
}

module.exports.updatePDFLog = async function (logJSON, logId) {

    [err, pdfLog] = await to(TOA_pdf_log.update(logJSON, { where: { id: logId } }));
    if (err) TE(err.message);
    return pdfLog;
}

// ==================== PDF Log ====================