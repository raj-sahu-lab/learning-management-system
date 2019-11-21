const { TOA_pollvote, TOA_polloption, TOA_poll } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');

module.exports.getPoll = async function (pollId) {

    [err, pollList] = await to(TOA_poll.findOne({

        where: { poll_id: pollId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['poll_id', 'id'], ['poll_title', 'title'], 'status'],
        group: ['pollOptions.polloption_id'],
        include: [
            {
                model: TOA_polloption,
                as: 'pollOptions',
                attributes: [['polloption_id', 'id'], ['polloption_title', 'option']]
            }
        ]
    }));

    if (err) TE(err.message);
    return pollList;
}
module.exports.isAnswerSubmitted = async function (pollId, studentId) {

    [err, pollAnswer] = await to(TOA_pollvote.findOne({

        where: { poll_id: pollId, learner_id: studentId }
    }));

    if (err) TE(err.message);
    return pollAnswer;
    

}

module.exports.saveStudentPollAnswer = async function (pollJson) {

    [err, pollResult] = await to(TOA_pollvote.create(pollJson));
    if (err) TE(err.message);
    return pollResult;

}

module.exports.getPollList = async function (accountId) {

    [err, pollList] = await to(TOA_poll.findAll({

        where: {account_id : accountId , delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['poll_id', 'id'], ['poll_title', 'title'], 'status'],
        include: [
            {
                model: TOA_polloption,
                as: 'pollOptions',
                attributes: [['polloption_title', 'option']],
            }
        ]
    }));

    if (err) TE(err.message);
    return pollList;
}

module.exports.getPollAnswered = async function (pollId) {

    [err, pollList] = await to(TOA_poll.findOne({

        where: { poll_id: pollId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['poll_id', 'id'], ['poll_title', 'title'], 'status'],
        group: ['pollOptions.polloption_id'],
        include: [
            {
                model: TOA_polloption,
                as: 'pollOptions',
                attributes: [ 
                    [ 'polloption_id' , 'id'] , ['polloption_title', 'option'],
                    [Sequelize.fn("COUNT", Sequelize.col("pollvote_id")), "optionCount"],
                ],
                include:[
                    {
                        model: TOA_pollvote,
                        as: 'pollAnswer',
                        attributes: []
                    }
                ]
            }
        ]
    }));

    if (err) TE(err.message);
    return pollList;
}

// module.exports.saveStudentPollAnswer = async function (pollJson) {

//     [err, pollResult] = await to(TOA_pollvote.create(pollJson));
//     if (err) TE(err.message);
//     return pollResult;

// }