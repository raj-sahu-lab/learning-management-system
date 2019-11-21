const termsAndAboutService = require('../../../services/V1/Institute/termsandprivacy.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


// ---------------------------------------------- Privacy Policies ---------------------------------------------- 

const addPrivacyPolicies = async function(req, res){

    const body = req.fields;
    if(!body.title){

        return ReE(res, 'Please Enter Title.', 422);

    } else if(!body.description){

        return ReE(res, 'Please Enter Description.', 422);

    } else {

        const privacyPolicy = {

            account_id: req.user.account_id,
            privacypolicy_title: body.title,
            privacypolicy_description: body.description,
            create_ip: req.ip,
        };
        
        [err, privacy] = await to(termsAndAboutService.addPrivacyPolicies(privacyPolicy));
        if (err) return ReE(res, err, 422);
        if (!privacy) TE('Failed to add privacy police. please try again');
        
        [err, privacy] = await to(termsAndAboutService.getPrivacyPolicies(privacy.toJSON().account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Privacy Policies added successfully.', privacy);

    }
}
module.exports.addPrivacyPolicies = addPrivacyPolicies;

const getPrivacyPolicies = async function(req, res){
    [err, privacy] = await to(termsAndAboutService.getPrivacyPolicies(req.user.account_id));
    if (err) return ReE(res, err, 422);
    if(privacy) {

        return ReS(res, 'Privacy get successfully.', privacy);

    } else {

        return ReE(res, 'No Privacy available.', 422);
    }
}
module.exports.getPrivacyPolicies = getPrivacyPolicies;

const updatePrivacyPolicies = async function(req, res){

    const body = req.fields;
    if(!body.id){

        return ReE(res, 'Id missing.', 422);

    } else if(!body.title){

        return ReE(res, 'Please Enter Title.', 422);

    } else if(!body.description){

        return ReE(res, 'Please Enter Description.', 422);

    } else {

        const privacyPolicy = {
    
            account_id: req.user.account_id,
            privacypolicy_title: body.title,
            privacypolicy_description: body.description,
            update_ip: req.ip,
        };
        
        [err, privacy] = await to(termsAndAboutService.updatePrivacyPolicies(privacyPolicy , body.id));
        if (err) return ReE(res, err, 422);
        if (!privacy) TE('Failed to update privacy police. please try again');
        
        [err, privacy] = await to(termsAndAboutService.getPrivacyPolicies(req.user.account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Privacy Policies updated successfully.', privacy);

    }
}
module.exports.updatePrivacyPolicies = updatePrivacyPolicies;

const deletePrivacyPolicies = async function(req, res){

    if (!req.params.id) {

        return ReE(res, 'Privacy id missing.');

    } else {

        [err, isSuccess] = await to(termsAndAboutService.deletePrivacyPolicies(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Privacy deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete Privacy. please try again.');
        }
    }
}
module.exports.deletePrivacyPolicies = deletePrivacyPolicies;

// ---------------------------------------------- Privacy Policies ---------------------------------------------- 

// ---------------------------------------------- About ---------------------------------------------- 

const addAboutUs = async function(req, res){

    const body = req.fields;
    if(!body.title){

        return ReE(res, 'Please Enter Title.', 422);

    } else if(!body.description){

        return ReE(res, 'Please Enter Description.', 422);

    } else {

        const about = {

            account_id: req.user.account_id,
            about_title: body.title,
            about_description: body.description,
            create_ip: req.ip,
        };
        
        [err, privacy] = await to(termsAndAboutService.addAboutUs(about));
        if (err) return ReE(res, err, 422);
        if (!privacy) TE('Failed to add about us. please try again');
        
        [err, privacy] = await to(termsAndAboutService.getAboutUs(privacy.toJSON().account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'About Us added successfully.', privacy);

    }
}
module.exports.addAboutUs = addAboutUs;

const getAboutUs = async function(req, res){
    
    if(req.user){
        
        [err, privacy] = await to(termsAndAboutService.getAboutUs(req.user.account_id));
        if (err) return ReE(res, err, 422);
        if(privacy) {
    
            return ReS(res, 'About get successfully.', privacy);
    
        } else {
    
            return ReE(res, 'No About available.', 422);
        }
    } else {
        return ReE(res, 'No About available.', 422);
    }
    
}
module.exports.getAboutUs = getAboutUs;

const updateAboutUs = async function(req, res){

    const body = req.fields;
    if(!body.id){

        return ReE(res, 'Id missing.', 422);

    } else if(!body.title){

        return ReE(res, 'Please Enter Title.', 422);

    } else if(!body.description){

        return ReE(res, 'Please Enter Description.', 422);

    } else {

        const about = {
    
            account_id: req.user.account_id,
            about_title: body.title,
            about_description: body.description,
            update_ip: req.ip,
        };
        
        [err, privacy] = await to(termsAndAboutService.updateAboutUs(about , body.id));
        if (err) return ReE(res, err, 422);
        if (!privacy) TE('Failed to update about us. please try again');
        
        [err, privacy] = await to(termsAndAboutService.getAboutUs(req.user.account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'About Us updated successfully.', privacy);

    }
}
module.exports.updateAboutUs = updateAboutUs;

const deleteAboutUs = async function(req, res){

    if (!req.params.id) {

        return ReE(res, 'About id missing.');

    } else {

        [err, isSuccess] = await to(termsAndAboutService.deleteAboutUs(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'About deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete About. please try again.');
        }
    }
}
module.exports.deleteAboutUs = deleteAboutUs;

// ---------------------------------------------- About ---------------------------------------------- 