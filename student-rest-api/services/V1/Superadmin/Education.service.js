const { TOA_education } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const addEducation = async function (educationInfo) {

    [err, offer] = await to(TOA_education.create(educationInfo));
    if (err) TE(err.message);
    return offer;
}
module.exports.addEducation = addEducation;

// Update Education
const updateEducation = async function (educationId, educationInfo) {

    [err, offer] = await to(TOA_education.update(educationInfo, { where: { id: educationId } }));
    if (err) TE(err.message);
    return offer;
}
module.exports.updateEducation = updateEducation;

const getEducationList = async function () {

    
    [err, offerList] = await to(TOA_education.findAll({
        where: { delete: 0 },
        order: [['title', 'ASC']],
        attributes: [ 'id', 'title' , 'status'],
    }));
    if (err) TE(err.message);
    return offerList;

}
module.exports.getEducationList = getEducationList;


module.exports.getEducation = async function (educationId) {

    [err, education] = await to(TOA_education.findOne({
        where: { id: educationId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'status'],
    }));
    if (err) TE(err.message);
    return education;
}

module.exports.getEducationByName = async function (educationTitle) {

    [err, education] = await to(TOA_education.findOne({
        where: { title: { [Op.like]: educationTitle  +'%' }, delete: 0 },
        attributes: [ 'id', 'title' , 'status'],
    }));
    if (err) TE(err.message);
    return education;
}

// Delete Education
const deleteEducation = async function (educationId) {

    const educationJson = {delete: 1};
    [err, offer] = await to(TOA_education.update(educationJson, { where: {id: educationId } }));
    if (err) TE(err.message);
    return offer;

}
module.exports.deleteEducation = deleteEducation;