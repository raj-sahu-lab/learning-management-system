const superAdminService = require('../../../services/V1/Superadmin/superadmin.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const tutorService = require('../../../services/V1/Institute/tutor.service');
const CONFIG = require('../../../config/config');
const { to, ReE, ReS, UploadImage, GetSignUrl, DeleteFromBucket } = require('../../../services/V1/util.service');
const fs = require('fs');
const sha1 = require('sha1');

// Add New Tutor
module.exports.addTutor = async function (req, res) {

    const body = req.fields;
    
    if (!body.branchId) {

        return ReE(res, 'Please select teacher branch.', 422);

    } else if (!body.name) {

        return ReE(res, 'Please enter tutor name.', 422);

    } else if (!body.email) {

        return ReE(res, 'Please enter tutor number.', 422);

    } else if (!body.password){

        return ReE(res, 'Please enter tutor password.', 422);

    } else {
        
        [err, users] = await to(superAdminService.userExist(body.email));
        if(users){

            return ReE(res, 'Email already exist. please use different email.', 422);
        }

        [err, users] = await to(branachService.userExist(body.email));
        if(users){

            return ReE(res, 'Email already exist. please use different email.', 422);
        }

        [err, users] = await to(tutorService.userExist(body.email));
        if(users){

            return ReE(res, 'Email already exist. please use different email.', 422);
        }

        if (req.files.image != null) {
            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = 'TOA_Tutor_' + (new Date().getTime().toString()) + '_' + req.files.image.name; 
        } else {
            var imageBuffer = fs.readFileSync(CONFIG.STATCI_FILES + 'default_profile.png');
            var name = (new Date().getTime().toString()) + '_' + 'default_profile.png';
        }
        [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
        if (err) return ReE(res, err, 422);

        let tutor = {

            account_id: req.user.account_id,
            branch_id: body.branchId,
            tutor_image: s3Bucket.Key,
            gender : body.gender,
            tutor_name: body.name,
            countryCode: body.countryCode ? body.countryCode : null,
            tutor_phone: body.phone,
            tutor_email: body.email,
            tutor_bio: body.bio,
            tutor_qualification: body.qualification,
            tutor_experience: body.experience,
            tutor_password: sha1(body.password),
            create_ip: req.ip
        };

        [err, tutor] = await to(tutorService.addTutor(tutor));
        if (err) return ReE(res, err, 422);

        if (tutor) {

            [err, tutor] = await to(tutorService.getTutor(req.user.account_id, tutor.tutor_id));
            var tutorObj = tutor.toJSON();
            tutorObj.image = await GetSignUrl(tutorObj.image);
            return ReS(res, 'Tutor added successfully.', tutorObj);

        } else {

            return ReE(res, 'Failed to add tutor, please try again.', 422);
        }
    }
}


//Get All Tutor List
module.exports.getTutorList = async function(req, res){

    if (req.params.isFiltered == 1) {

        [err, tutorList] = await to(tutorService.getFilteredTutorList(req.user));
        if (err) return ReE(res, err, 422);

        if (tutorList.length == 0) {

            return ReE(res, 'Tutor list not available.', 204);

        } else {

            var tutorSignedList = [];

            await Promise.all(tutorList.map(async (tutor) => {

                if(tutor.subject == null){

                    tutorSignedList.push(tutor)
                }
            }));

            return ReS(res, 'All Tutor List Got Successfully.', tutorSignedList);
        }

    } else {
        
        [err, tutorList] = await to(tutorService.getTutorList(req.user));
        if (err) return ReE(res, err, 422);

        if (tutorList.length == 0) {

            return ReE(res, 'Tutor list not available.', 204);

        } else {

            var tutorSignedList = [];

            await Promise.all(tutorList.map(async (tutor) => {

                var tutor = tutor.toJSON();
                tutor.image = await GetSignUrl(tutor.image);
                tutorSignedList.push(tutor)

            }));

            return ReS(res, 'All Tutor List Got Successfully.', tutorSignedList);
        }
    }
}

// Update Existing Tutor
module.exports.updateTutor = async function (req, res) {

    const body = req.fields;
    
    if(!body.tutorId){

        return ReE(res, 'Please enter tutor id.', 422);

    } else if (!body.name) {

        return ReE(res, 'Please enter tutor name.', 422);

    }else if (!body.email) {

        return ReE(res, 'Please enter tutor number.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select subject status.', 422);
        
    } else {

        [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
        if (err) return ReE(res, err, 422);

        var imageName = tutor.toJSON().image;

        if (req.files.image != null) {

            if(imageName){

                [err, result] = await to(DeleteFromBucket(imageName));
                if (err) return ReE(res, err, 422);
            }
           
            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = 'TOA_Tutor_' + (new Date().getTime().toString()) + '_' + req.files.image.name;    
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
    
            if (err) return ReE(res, err, 422);
            imageName = s3Bucket.Key;

        } 
       
        var tutor = {

            account_id: req.user.account_id,
            tutor_image: imageName,
            tutor_name: body.name,
            gender : body.gender,
            countryCode: body.countryCode ? body.countryCode : null,
            tutor_phone: body.phone,
            tutor_email: body.email,
            tutor_bio: body.bio,
            tutor_qualification: body.qualification,
            tutor_experience: body.experience,
            status: body.status,
            update_ip: req.ip
            
        };

        if (body.password){

            tutor.tutor_password = sha1(body.password)
        } 

        [err, tutor] = await to(tutorService.updateTutor(body.tutorId,tutor));
        if (err) return ReE(res, err, 422);

        if (tutor.length === 1) {

            [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
            var tutorObj = tutor.toJSON();
            tutorObj.image = await GetSignUrl(tutorObj.image);
            return ReS(res, 'Tutor updated successfully.', tutorObj);

        } else {

            return ReE(res, 'Failed to update tutor, please try again.', 422);
        }
    }
}

// Delete Tutor
module.exports.deleteTutor = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Tutor id missing.');

    } else {

        [err, isSuccess] = await to(tutorService.deleteTutor(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Tutor Deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete tutor. please try again.');
        }
    }
}

module.exports.getTutorListByBranch = async function (req, res) {

    const branchId = req.params.branchId;

    [err, tutorList] = await to(tutorService.getTutorListByBranch(branchId));
        if (err) return ReE(res, err, 422);

        if (tutorList.length == 0) {

            return ReE(res, 'Tutor list not available.', 204);

        } else {

            var tutorSignedList = [];

            await Promise.all(tutorList.map(async (tutor) => {

                var tutor = tutor.toJSON();
                tutor.image = await GetSignUrl(tutor.image);
                tutorSignedList.push(tutor)

            }));

            return ReS(res, 'All Tutor List Got Successfully.', tutorSignedList);
        }
}