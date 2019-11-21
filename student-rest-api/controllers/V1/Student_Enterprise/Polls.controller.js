const pollService = require('../../../services/V1/Student_Enterprise/Polls.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

module.exports.PollList = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;

    [err, poll] = await to(pollService.getPollList(accountId));
    if (err) return ReE(res, err, 422);
    if (poll.length == 0) {

        return ReE(res, 'Poll Get Successfully.', 204);

    } else {

        return ReS(res, 'Poll Get Successfully.', poll);
    }
}

module.exports.saveStudentPollAnswer = async function (req, res) {

    const body = req.fields;
    if (!body.pollId) {

        return ReE(res, 'Poll id missing.', 422);

    } else if (!body.pollSelectedOptionId) {

        return ReE(res, 'Please select any one option.', 422);

    } else {

        const pollAnswerJson = {
            learner_id: req.user.id,
            poll_id: body.pollId,
            polloption_id: body.pollSelectedOptionId,
            create_ip: req.ip
        };

        [err, pollAnswer] = await to(pollService.saveStudentPollAnswer(pollAnswerJson));
        if (err) return ReE(res, err, 422);

        [err, poll] = await to(pollService.getPollAnswered(body.pollId));
            if (err) return ReE(res, err, 422);

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
    }
}

module.exports.GetPoll = async function (req, res) {

    const pollId = req.params.id;
    if (!pollId) {

        return ReE(res, 'Poll id missing.', 422);

    } else {

        [err, poll] = await to(pollService.isAnswerSubmitted(pollId, req.user.id));

        if (poll){

            [err, poll] = await to(pollService.getPollAnswered(pollId));
            if (err) return ReE(res, err, 422);

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

            [err, poll] = await to(pollService.getPoll(pollId));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Poll get successfully.', poll);
        }
    }
}









// module.exports.GetPoll = async function (req, res) {

//     const pollId = req.params.id;
//     if (!pollId) {

//         return ReE(res, 'Poll id missing.', 422);

//     } else {

//         [err, poll] = await to(pollService.getPoll(pollId));
//         if (err) return ReE(res, err, 422);

//         if(!poll){ 

//             return ReS(res, 'Poll Get Successfully.',{id:pollId} );
//         }

//         if (poll.length == 0) {

//             return ReE(res, 'Poll Get Successfully.', 204);

//         } else {
//             let totalPolls = poll.pollOptions.reduce((acc,opt)=> acc + opt.toJSON().optionCount,0)

//             let pollOptions = poll.pollOptions.map(opt=>{
//                 console.log(opt.id)

//                 let returnValue = {
//                     id:opt.toJSON().id,
//                     option:opt.toJSON().option
//                 }
//                 if(opt.toJSON().optionCount){
//                     returnValue.optionCount = opt.toJSON().optionCount
//                     returnValue.optionCount = opt.toJSON().optionCount
//                     returnValue.per =  (opt.toJSON().optionCount/totalPolls ) * 100
//                 }
//                 return returnValue
//             })
//             let pollData = {
//                 id:poll.toJSON().id,
//                 title:poll.toJSON().title,
//                 optionCount:poll.toJSON().optionCount,
//                 pollOptions:pollOptions
//             }
//             return ReS(res, 'Poll Get Successfully.', pollData);
//         }
//     }
// }

// module.exports.saveStudentPollAnswer = async function (req, res) {

//     const body = req.fields;
//     if (!body.pollId) {

//         return ReE(res, 'Poll id missing.', 422);

//     } else if (!body.pollSelectedOptionId) {

//         return ReE(res, 'Please select any one option.', 422);

//     } else {

//         const pollAnswerJson = {

//             learner_id: req.user.id,
//             poll_id: body.pollId,
//             polloption_id: body.pollSelectedOptionId,
//             create_ip: req.ip

//         };

//         [err, pollAnswer] = await to(pollService.saveStudentPollAnswer(pollAnswerJson));
//         if (err) return ReE(res, err, 422);

//         return ReS(res, 'Poll Answer Stored Successfully.', pollAnswer);
//     }
// }