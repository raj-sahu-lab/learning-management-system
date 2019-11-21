const { TOA_liveclass_group_students , TOA_liveclass_group, TOA_live_classes,TOA_Zoom_Users ,TOA_student, TOA_BlueJeance_Users, TOA_tutor, TOA_liveclass_api_key, TOA_branch, TOA_account } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Zoom

module.exports.createZoomUser = async function (userDetail) {

    [err, user] = await to(TOA_Zoom_Users.create(userDetail));
    if (err) TE(err.message);
    return user;
}

module.exports.getZoomUser = async function (userId) {

    [err, user] = await to(TOA_Zoom_Users.findOne({

        where: { id: userId, delete: 0 },
        attributes: ['id', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
                include : [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        required: false,
                        attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'name']],
                        include: [
                            {
                                model: TOA_liveclass_api_key,
                                as : "liveClassKey",
                                where: { liveclass_type : "zoom", status: 0, delete: 0 },
                                attributes: [['liveclass_apikey', 'key'], ['liveclass_apisecret', 'secret']]
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return user;
}

module.exports.getZoomUserList = async function (accountId) {

    [err, user] = await to(TOA_Zoom_Users.findAll({

        where: { accountId: accountId, delete: 0 },
        attributes: ['id', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
            }
        ]
    }));
    if (err) TE(err.message);
    return user;
}

// End zoom

// BlueJeance

module.exports.createBlueJeanceUser = async function (userDetail) {

    [err, user] = await to(TOA_BlueJeance_Users.create(userDetail));
    if (err) TE(err.message);
    return user;
}

module.exports.getBlueJeanceUser = async function (userId) {

    [err, user] = await to(TOA_BlueJeance_Users.findOne({

        where: { id: userId, delete: 0 },
        attributes: ['id', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
            }
        ]
    }));
    if (err) TE(err.message);
    return user;
}

module.exports.getBlueJeanceUserList = async function (accountId) {

    [err, user] = await to(TOA_BlueJeance_Users.findAll({

        where: { accountId: accountId, delete: 0 },
        attributes: ['id', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
            }
        ]
    }));
    if (err) TE(err.message);
    return user;
}

// End BlueJeance

module.exports.createLiveClass = async function (liveClass) {

    [err, liveClass] = await to(TOA_live_classes.create(liveClass));
    if (err) TE(err.message);
    return liveClass;
}

module.exports.getLiveClass = async function (liveClassId) {
    [err, liveClass] = await to(TOA_live_classes.findOne({

        where: { id: liveClassId , delete : 0},
        attributes: ['id','userType', 'liveClassUserId', 'image', 'title', 'scheduleTime', 'duration', 'studentIds', 'agenda', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
                include:[{
                    model: TOA_branch,
                    as: 'branch',
                    attributes: [['branch_id','id']],
                    include: [{
                        model: TOA_liveclass_api_key,
                        as: 'liveClassKey',
                        attributes: [['liveclass_apikey', 'key']]
                    }]
                }]
            }
        ]
    }));
    if (err) TE(err.message);
    return liveClass;
}

module.exports.getLiveClassList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if(user.userType == 3){
        whereTutorJson.tutor_id = user.id;
    }

    [err, liveClassList] = await to(TOA_live_classes.findAll({
        order: [['id', 'DESC']],
        where: { accountId: user.account_id, delete: 0 },
        attributes: ['id', 'userType', 'image', 'title', 'scheduleTime', 'duration', 'studentIds', 'agenda', 'response'],
        include: [
            {
                model: TOA_tutor,
                as: 'tutor',
                where: whereTutorJson,
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode', ['tutor_phone', 'phone'], ['tutor_email', 'email']],
                include:
                [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        attributes: [['branch_id','id']],
                        include: [{
                            model: TOA_liveclass_api_key,
                            as: 'liveClassKey',
                            attributes: [['liveclass_apikey', 'key']]
                        }]
                    },
                    {
                        model: TOA_BlueJeance_Users,
                        as: 'blueJeance'
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return liveClassList;
}

module.exports.getStudentList = async function (studentIds) {

    [err, studentList] = await to(TOA_student.findAll({

        where: { id: { [Op.in]: studentIds.split(",") }, delete: 0 },
        attributes: ['id', 'image', 'first_name', 'last_name', 'email', 'countrycode', 'phone'],
    }));
    if (err) TE(err.message);
    return studentList;
}

module.exports.updateLiveClass = async function (liveClassId, liveClass) {

    [err, liveClass] = await to(TOA_live_classes.update(liveClass, { where: { id: liveClassId } }));
    if (err) TE(err.message);
    return liveClass;
}

// Check tutor is Exist in zoom user or not
module.exports.tutorExistbyTutorId = async function (tutorId) {

    [err, zoomUser] = await to(TOA_Zoom_Users.findOne({ where: { tutorId: tutorId } }));
    if (err) TE(err.message);
    return zoomUser;
}

// check key exists
const checkKeyByType = async function (branchId, liveclassType) {

    [err, key] = await to(TOA_liveclass_api_key.findOne({ where: { branch_id: branchId,  liveclass_type : liveclassType} }));
    if (err) TE(err.message);
    return key;
}
module.exports.checkKeyByType = checkKeyByType;

// add api key
const addLiveClassKey = async function (liveclassKeyData) {

    [err, liveclasskey] = await to(TOA_liveclass_api_key.create(liveclassKeyData));
    if (err) TE(err.message);
    return liveclasskey;

}
module.exports.addLiveClassKey = addLiveClassKey;

// edit api key
const editLiveClassKey = async function (liveclassKeyId,liveclassKeyData) {

    [err, liveClasskey] = await to(TOA_liveclass_api_key.update(liveclassKeyData, { where: { id: liveclassKeyId } }));
    if (err) TE(err.message);
    return liveClasskey;

}
module.exports.editLiveClassKey = editLiveClassKey;

// get all key
const getLiveClassKey = async function (user) {

    if(user.account_id){
        [err, keyList] = await to(TOA_account.findOne({
            where: { account_id: user.account_id , delete : 0, status : 0 },
            attributes: ['account_id'],
            require : false,
            include : [
                {
                    model: TOA_branch,
                    as: 'branches',
                    attributes : ['branch_id', 'branch_name'],
                    required : false,
                    include : [{
                        model: TOA_liveclass_api_key,
                        as: 'liveClassKey',
                        attributes: ['id', ['branch_id', 'branchId'], ['liveclass_type' , 'type'], ['liveclass_apikey' , 'key'],['liveclass_apisecret', 'secret'], ['android_apikey' , 'androidkey'],['android_apisecret', 'androidSecret']]
                    }]
                }
            ]
        }));
        if (err) TE(err.message);
        return keyList.branches;
    } else {
        TE("branch not found");
    }

}
module.exports.getLiveClassKey = getLiveClassKey;




//Create liveclass group
module.exports.createLiveclassGroup = async function (groupDetail) {
    [err, group] = await to(TOA_liveclass_group.create(groupDetail));
    if (err) TE(err.message);
    return group;
}

//Check unique group name
module.exports.checkUniqueGroupName = async function (groupName) {
    [err, group] = await to(TOA_liveclass_group.findOne({ where: { group_name: groupName } }));
    if (err) TE(err.message);
    return group;
}


//Add students to group
module.exports.addStudentsToGroup = async function (studentsGroup) {
    [err, studentgroup] = await to(TOA_liveclass_group_students.bulkCreate(studentsGroup));
    if (err) TE(err.message);
    return studentgroup;
}


//Check students in group
module.exports.checkStudentsInGroup = async function (group_id, studentsList) {
    [err, studentList] = await to(TOA_liveclass_group_students.findAll({
        where: { group_id: group_id, student_id: { [Op.in]: studentsList } }
    }));
    if (err) TE(err.message);
    return studentList;
}


//Get Liveclass group
module.exports.getLiveClassGroup = async function (groupId) {

    [err, group] = await to(TOA_liveclass_group.findOne({
        where: { group_id: groupId, delete: 0 },
        attributes: ['group_id', 'group_name', 'status', 'delete'],
        include: [
            {
                model: TOA_liveclass_group_students,
                as: 'group',
                attributes: ['id'],
                include: [
                    {
                        model: TOA_student,
                        as: 'student',
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'image'],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return group;
}



// Get All live class groups
module.exports.getAllLiveClassGroups = async function () {

    [err, groups] = await to(TOA_liveclass_group.findAll({
        where: { delete: 0 },
        attributes: ['group_id', 'group_name', 'status', 'delete'],
        include: [
            {
                model: TOA_liveclass_group_students,
                as: 'group',
                attributes: ['id'],
                include: [
                    {
                        model: TOA_student,
                        as: 'student',
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'image'],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return groups;
}




//Remove students from group
module.exports.removeStudentsFromGroup = async function (group_id, studentsList) {
    [err, studentList] = await to(TOA_liveclass_group_students.destroy({
        where: { group_id: group_id, student_id: { [Op.in]: studentsList } }
    }));
    if (err) TE(err.message);
    return studentList;
}