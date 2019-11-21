const { TOA_poll, TOA_polloption , TOA_pollvote } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');


// ==================================================== Poll ========================================================
// Creating new pooll
const createPoll = async function (pollInfo) {

    [err, poll] = await to(TOA_poll.create(pollInfo));
    if (err) TE(err.message);
    return poll;
}
module.exports.createPoll = createPoll;


const getPoll = async function (accountId , pollId) {

    [err, pollList] = await to(TOA_poll.findOne({

        where: { account_id: accountId, poll_id: pollId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['poll_id', 'id'], ['poll_title', 'title'], 'status'],
        include: [
            {
                model: TOA_polloption,
                as: 'pollOptions',
                attributes: [['polloption_id', 'id'],['polloption_title', 'option'], 'status']
            }
        ]
    }));

    if (err) TE(err.message);
    return pollList;
}
module.exports.getPoll = getPoll;


const getPollList = async function (accountId) {

    [err, pollList] = await to(TOA_poll.findAll({

        where: { account_id: accountId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['poll_id', 'id'], ['poll_title', 'title'], 'status'],
        include: [
            {
                model: TOA_polloption,
                as: 'pollOptions',
                attributes: [['polloption_id', 'id'],['polloption_title', 'option'], 'status']
            }
        ]
    }));
    
    if (err) TE(err.message);
    return pollList;
}
module.exports.getPollList = getPollList;

const deletePoll = async function (pollId, pollInfo) {

    [err, poll] = await to(TOA_poll.update(pollInfo , { where : {poll_id : pollId}}));
    if (err) TE(err.message);
    return poll;
}
module.exports.deletePoll = deletePoll;


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

// ==================================================== Poll ========================================================

// ==================================================== Poll Options ========================================================

const addPollOptions = async function(options){

    [err, optionsList] = await to(TOA_polloption.bulkCreate(options));
    if (err) TE(err.message);
    return optionsList;
}
module.exports.addPollOptions = addPollOptions;


// ==================================================== Poll Options ========================================================