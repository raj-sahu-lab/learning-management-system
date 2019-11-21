const educationService = require('../../../services/V1/Superadmin/Education.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


const getEducationList = async function (req, res) {

    [err, educationList] = await to(educationService.getEducationList());
    if (err) return ReE(res, err, 422);


    if (educationList.length == 0) {

        return ReE(res, 'Educations Not Available', 204);

    } else {

        return ReS(res, 'All Education List Got Successfully.', educationList);
    }


}
module.exports.getEducationList = getEducationList;


const addEducation = async function (req, res) {

    const body = req.fields;

     if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {


        let educationBody = {
            title: body.title,
            create_ip: req.ip,
        };

        [err, education] = await to(educationService.addEducation(educationBody));
        if (err) return ReE(res, err, 422);

        if (education) {

            [err, education] = await to(educationService.getEducation(education.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Education added successfully.', education);

        } else {

            return ReE(res, 'Failed to add education, please try again.', 422);
        }
    }
}
module.exports.addEducation = addEducation;

const updateEducation = async function (req, res) {

    const body = req.fields;
    if (!body.educationId) {

        return ReE(res, 'Please enter education id.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let educationBody = {
            
            title: body.title,
            update_ip: req.ip,
            status: body.status
        };

        [err, education] = await to(educationService.updateEducation(body.educationId, educationBody));
        if (err) return ReE(res, err, 422);

        if (education.length === 1 && education[0] == 1) {

            [err, education] = await to(educationService.getEducation(body.educationId));
            return ReS(res, 'Education updated successfully.', education);

        } else {

            return ReE(res, 'Failed to update education, please try again.', 422);
        }
    }
}
module.exports.updateEducation = updateEducation;

const deleteEducation = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Education id missing.');

    } else {

        [err, education] = await to(educationService.deleteEducation( req.params.id));
        if (err) return ReE(res, err, 422);
        if (education.length === 1 && education[0] == 1) {

            return ReS(res, 'Education deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete education. please try again.');
        }
    }
}
module.exports.deleteEducation = deleteEducation;