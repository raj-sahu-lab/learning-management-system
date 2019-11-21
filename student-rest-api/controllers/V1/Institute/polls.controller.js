const { to, ReE, ReS } = require('../../../services/V1/util.service');
const pollService = require('../../../services/V1/Institute/polls.service');
const fs = require('fs');



//Add New Poll
const addNewPoll = async function (req, res) {

    let body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please Enter poll title', 422);
    }
    else if (!body.options) {

        return ReE(res, 'Please Enter poll options.', 422);
    }
    else if (body.options.length == 0) {

        return ReE(res, 'Please Enter poll options.', 422);
    }
    else {

        let pollInfo = {

            account_id: req.user.account_id,
            poll_title: body.title,
            create_ip: req.ip
        };

        [err, poll] = await to(pollService.createPoll(pollInfo));
        if (err) return ReE(res, err, 422);

        if(poll){
            
            const pollId = poll.toJSON().poll_id;
            
            let arrPollOptionsInfo = [];
            await Promise.all(body.options.map(async (option) => {
    
                const poll_json = {

                    account_id: req.user.account_id,
                    poll_id: pollId,
                    polloption_title: option,
                    create_ip: req.ip
                };

                arrPollOptionsInfo.push(poll_json)
            }));
            
            [err, pollOptions] = await to(pollService.addPollOptions(arrPollOptionsInfo));
            if (err) return ReE(res, err, 422);
            
            [err, poll] = await to(pollService.getPoll(req.user.account_id,pollId));

            return ReS(res, 'Poll Added Successfully.', poll);

        } else {

            return ReE(res, 'Failed to add poll. please try again.', 422);

        }
    }
}
module.exports.addNewPoll = addNewPoll;


//Get All Poll List
const getPollList = async function (req, res) {
        
    [err, poll] = await to(pollService.getPollList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if(poll.length == 0){

        return ReE(res, 'Poll Get Successfully.', 204);

    } else {

        return ReS(res, 'Poll Get Successfully.', poll);
    }
}
module.exports.getPollList = getPollList;


const deletePoll = async function (req, res) {
    
    const pollId = req.params.id;
    if(!pollId){

        return ReE(res, 'Poll id missing.', 422);

    } else {

        const pollInfo = {
            delete: 1,
            update_ip: req.ip
        };

        [err, poll] = await to(pollService.deletePoll(pollId,pollInfo));
        if (err) return ReE(res, err, 422);

        if(poll.length == 1 && poll[0] == 1){
            
            return ReS(res, 'Poll Deleted Successfully.', null);

        } else {

            return ReE(res, 'Failed to delete poll. please try again.', 422);

        }
    }
}
module.exports.deletePoll = deletePoll;


module.exports.GetPollResult = async function (req, res) {

    const pollId = req.params.id;
    if (!pollId) {

        return ReE(res, 'Poll id missing.', 422);

    } else {

        [err, poll] = await to(pollService.getPollAnswered(pollId));
            if (err) return ReE(res, err, 422);
        if(poll){

            let totalPolls = poll.pollOptions.reduce((acc, opt) => acc + opt.toJSON().optionCount, 0)
            let pollOptions = poll.pollOptions.map(opt => {
                let returnValue = {
                    id: opt.toJSON().id,
                    option: opt.toJSON().option,
                }

                returnValue.optionCount = opt.toJSON().optionCount
                returnValue.per = (opt.toJSON().optionCount / totalPolls) * 100

                return returnValue
            })
            let pollData = {
                id: poll.toJSON().id,
                title: poll.toJSON().title,
                optionCount: poll.toJSON().optionCount,
                pollOptions: pollOptions
            }
            return ReS(res, 'Poll get successfully.', pollData);
            
        } else {

            return ReE(res, 'Poll not found.', 422);
        }
            
    }
}