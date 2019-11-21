const adminOverViewService = require('../../../services/V1/Superadmin/Overview.service');

const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');


module.exports.getTutorList = async function (req, res) {

    const accountId = req.params.id;


    [err, activeBranchList] = await to(adminOverViewService.getBranchList({ account_id: accountId , status: 0 ,delete : 0 }));
    [err, deactiveBranchList] = await to(adminOverViewService.getBranchList({ account_id: accountId , status: 1 ,delete : 0 }));
    [err, deletedBranchList] = await to(adminOverViewService.getBranchList({ account_id: accountId , delete : 1 }));
    
    const branchJSON = {
        count: {
            active : activeBranchList.length,
            deactive : deactiveBranchList.length,
            deleted : deletedBranchList.length,    
        },
        list: {
            active : activeBranchList,
            deactive : deactiveBranchList,
            deleted : deletedBranchList,    
        },
    };
    
    [err, activeTutorList] = await to(adminOverViewService.getTutorList({ account_id: accountId , status: 0 ,delete : 0 }));
    [err, deactiveTutorList] = await to(adminOverViewService.getTutorList({ account_id: accountId , status: 1 ,delete : 0 }));
    [err, deletedTutorList] = await to(adminOverViewService.getTutorList({ account_id: accountId , delete : 1 }));
    
    var activeTutorListSigned = []
    for (let index = 0; index < activeTutorList.length; index++) {

        var tutorJSON = activeTutorList[index].toJSON();        
        if(tutorJSON.image){
            tutorJSON.image = await GetSignUrl(tutorJSON.image);
        }
        activeTutorListSigned.push(tutorJSON);
    }

    var deactiveTutorListSigned = []
    for (let index = 0; index < deactiveTutorList.length; index++) {

        var tutorJSON = deactiveTutorList[index].toJSON();        
        if(tutorJSON.image){
            tutorJSON.image = await GetSignUrl(tutorJSON.image);
        }
        deactiveTutorListSigned.push(tutorJSON);
    }

    var deletedTutorListSigned = []
    for (let index = 0; index < deletedTutorList.length; index++) {

        var tutorJSON = deletedTutorList[index].toJSON();        
        if(tutorJSON.image){
            tutorJSON.image = await GetSignUrl(tutorJSON.image);
        }
        deletedTutorListSigned.push(tutorJSON);
    }

    var tutorJSON = {
        count: {
            active : activeTutorListSigned.length,
            deactive : deactiveTutorListSigned.length,
            deleted : deletedTutorListSigned.length,    
        },
        list: {
            active : activeTutorListSigned,
            deactive : deactiveTutorListSigned,
            deleted : deletedTutorListSigned,    
        },
    };
    
    


    return ReS(res, 'Tutor list', {branch  : branchJSON , tutor : tutorJSON});

}

module.exports.getStudentList = async function (req, res) {


    const accountId = req.params.id;

    [err, activeStudentList] = await to(adminOverViewService.getLearnerList(accountId, { status: 0 ,delete : 0 }));
    [err, deactiveStudentList] = await to(adminOverViewService.getLearnerList(accountId , { status: 1 ,delete : 0 }));
    [err, deletedStudentList] = await to(adminOverViewService.getLearnerList(accountId , { delete : 1 }));
    
    var activeStudentListSigned = []
    for (let index = 0; index < activeStudentList.length; index++) {

        var studentJSON = activeStudentList[index].toJSON();        
        if(studentJSON.image){
            studentJSON.image = await GetSignUrl(studentJSON.image);
        }
        activeStudentListSigned.push(studentJSON);
    }

    var deactiveStudentListSigned = []
    for (let index = 0; index < deactiveStudentList.length; index++) {

        var studentJSON = deactiveStudentList[index].toJSON();        
        if(studentJSON.image){
            studentJSON.image = await GetSignUrl(studentJSON.image);
        }
        deactiveStudentListSigned.push(studentJSON);
    }

    var deletedStudentListSigned = []
    for (let index = 0; index < deletedStudentList.length; index++) {

        var studentJSON = deletedStudentList[index].toJSON();        
        if(studentJSON.image){
            studentJSON.image = await GetSignUrl(studentJSON.image);
        }
        deletedStudentListSigned.push(studentJSON);
    }

    var studentJSON = {
        count: {
            active : activeStudentListSigned.length,
            deactive : deactiveStudentListSigned.length,
            deleted : deletedStudentListSigned.length,    
        },
        list: {
            active : activeStudentListSigned,
            deactive : deactiveStudentListSigned,
            deleted : deletedStudentListSigned,    
        },
    };
    

    return ReS(res, 'Student list', studentJSON);
}