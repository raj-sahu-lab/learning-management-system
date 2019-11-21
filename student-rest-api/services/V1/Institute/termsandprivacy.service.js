const { TOA_about, TOA_privacypolicy } = require('../../../models');
const { to, TE } = require('../util.service');

// ---------------------------------------------- Privacy Policies ---------------------------------------------- 

const addPrivacyPolicies = async function(privayJson) {

    [err, privacy] = await to(TOA_privacypolicy.create(privayJson));
    if (err) TE(err.message);
    return privacy;
}
module.exports.addPrivacyPolicies = addPrivacyPolicies;

const getPrivacyPolicies = async function(accountId){

     [err, privacy] = await to(TOA_privacypolicy.findOne(
        { 
            where: { account_id: accountId , delete: 0 } ,
            order: [['updatedAt', 'DESC']],
            attributes: [['privacypolicy_id','id'] , ['privacypolicy_title','title'] , ['privacypolicy_description' , 'description']]
        }));
    if (err) TE(err.message);
    return privacy;
}
module.exports.getPrivacyPolicies = getPrivacyPolicies;

const updatePrivacyPolicies = async function(privayJson,privacyId){

    [err, privacy] = await  to(TOA_privacypolicy.update(privayJson, { where: { privacypolicy_id: privacyId } }));
    if (err) TE(err.message);
    return privacy;
}
module.exports.updatePrivacyPolicies = updatePrivacyPolicies;

const deletePrivacyPolicies = async function(accountId,privacyId){

    const privacyJson = {delete: 1};
    [err, privacy] = await to(TOA_privacypolicy.update(privacyJson, { where: {  account_id: accountId, privacypolicy_id: privacyId } }));
    if (err) TE(err.message);    
    return privacy;
}
module.exports.deletePrivacyPolicies = deletePrivacyPolicies;

// ---------------------------------------------- Privacy Policies ---------------------------------------------- 


// ---------------------------------------------- About ---------------------------------------------- 

const addAboutUs = async function(aboutJson) {

    [err, about] = await to(TOA_about.create(aboutJson));
    if (err) TE(err.message);
    return about;
}
module.exports.addAboutUs = addAboutUs;

const getAboutUs = async function(accountId){

     [err, about] = await to(TOA_about.findOne(
        { 
            where: { account_id: accountId , delete: 0 } ,
            order: [['updatedAt', 'DESC']],
            attributes: [['about_id','id'] , ['about_title','title'] , ['about_description' , 'description']]
        }));
    if (err) TE(err.message);
    return about;
}
module.exports.getAboutUs = getAboutUs;

const updateAboutUs = async function(aboutJson,aboutId){

    [err, about] = await  to(TOA_about.update(aboutJson, { where: { about_id: aboutId } }));
    if (err) TE(err.message);
    return about;
}
module.exports.updateAboutUs = updateAboutUs;

const deleteAboutUs = async function(accountId,aboutId){

    const aboutJson = {delete: 1};
    [err, about] = await to(TOA_about.update(aboutJson, { where: {  account_id: accountId, about_id: aboutId } }));
    if (err) TE(err.message);    
    return about;
}
module.exports.deleteAboutUs = deleteAboutUs;

// ---------------------------------------------- About ---------------------------------------------- 
