const { to, ReE, ReS } = require('../../../services/V1/util.service');
const planService = require('../../../services/V1/Superadmin/plan.service');
const fs = require('fs');
// ==================================================== Term ========================================================

//Add New Term
const addTerm = async function (req, res) {

    let body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please Enter term title', 422);
    }
    else if (!body.month) {

        return ReE(res, 'Please Enter term month', 422);
    }
    else if (!body.days) {

        return ReE(res, 'Please Enter days month', 422);
    }
    else {

        let term = {
            account_id: req.user.id,
            term_title: body.title,
            term_month: body.month,
            term_days: body.days,
            create_ip: req.ip
        };
        
        [err, term] = await to(planService.createTerm(term));
        if (err) return ReE(res, err, 422);

        if(term){
            
            [err,term] = await to(planService.getTerm(term.toJSON().term_id));
            return ReS(res, 'Term Added Successfully.', term);

        } else {

            return ReE(res, 'Failed to add term. please try again.', 422);

        }
    }
}
module.exports.addTerm = addTerm;

//Edit Term
const editTerm = async function (req, res) {

    let body = req.fields;

    if(!body.termId){

        return ReE(res, 'Term id missing.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please Enter term title', 422);

    } else if (!body.month) {

        return ReE(res, 'Please Enter term month', 422);

    } else if (!body.days) {

        return ReE(res, 'Please Enter days month', 422);

    } else {

        let term = {
            account_id: req.user.id,
            term_title: body.title,
            term_month: body.month,
            term_days: body.days,
            update_ip: req.ip
        };

        [err, term] = await to(planService.editTerm(body.termId,term));
        if (err) return ReE(res, err, 422);

        if(term.length == 1 && term[0] == 1){
            
            [err,term] = await to(planService.getTerm(body.termId));
            return ReS(res, 'Term Updated Successfully.', term);

        } else {

            return ReE(res, 'Failed to update term. please try again.', 422);

        }
    }
}
module.exports.editTerm = editTerm;

// Get Term List
const getTermList = async function (req, res) {

    [err, termList] = await to(planService.getTermList(req.user.id));
    if (err) return ReE(res, err, 422);
    if(termList.length == 0){

        return ReE(res, 'Term List Get Successfully.', 204);
    }
    else{

        return ReS(res, 'Term List Get Successfully.', termList,200);
    }
    
};
module.exports.getTermList = getTermList;

//Delete Term
const deleteTerm = async function (req, res) {    

    const termId = req.params.id;
    if(!termId){

        return ReE(res, 'Term id missing.', 422);

    } else {

        let term = {
            delete: 1,
            update_ip: req.ip
        };

        [err, term] = await to(planService.editTerm(termId,term));
        if (err) return ReE(res, err, 422);

        if(term.length == 1 && term[0] == 1){
            
            return ReS(res, 'Term Deleted Successfully.', null);

        } else {

            return ReE(res, 'Failed to delete term. please try again.', 422);

        }
    }
}
module.exports.deleteTerm = deleteTerm;

// ==================================================== Term ========================================================
// ==================================================================================================================
// ==================================================== Plan ========================================================

// Add New Plan
const createPlan = async function (req, res) {

    let body = req.fields;

    if (!body.term_id) {

        return ReE(res, 'Please Select Term', 422);

    } else if (!body.title) {

        return ReE(res, 'Please Enter plan title', 422);

    } else if (!body.amount) {

        return ReE(res, 'Please Enter plan amount', 422);

    } else if (!body.amountUSD) {

        return ReE(res, 'Please Enter plan amount', 422);

    } else if (!body.emailSubject) {

        return ReE(res, 'Please Enter email subject.', 422);

    } else if (!body.emailContent) {

        return ReE(res, 'Please Enter email content.', 422);

    } else {

        let plan = {

            account_id: req.user.id,
            term_id : body.term_id,
            plan_title: body.title,
            plan_amount: body.amount,
            plan_amount_usd: body.amountUSD,
            subject_title: body.emailSubject,
            mail_content: body.emailContent,
            create_ip: req.ip

        };

        [err, plan] = await to(planService.createPlan(plan));
        if (err) return ReE(res, err, 422);
        if (plan) {


            const planId = plan.toWeb().plan_id;

            var arrAllPermissionJson = [];
            await Promise.all(body.menuPermission.map(async (menuPermission) => {
    
                const permissionJson = {

                    plan_id: planId,
                    menuPermissions: menuPermission.selectedMenuId,
                    subMenuPermissions: menuPermission.selectedSubMenuId,
                    create_ip: req.ip
                };

                arrAllPermissionJson.push(permissionJson)
            }));

            [err, plan] = await to(planService.addPlanPermissions(arrAllPermissionJson));
            if (err) return ReE(res, err, 422);

            [err, plan] = await to(planService.getPlan(planId));

            return ReS(res, 'Plan Added Successfully.', plan);

        } else  {

            return ReE(res, 'Failed to create plan. please try again.', 422);
        }
        
    }


}
module.exports.createPlan = createPlan;

// Edit Plan
const editPlan = async function (req, res) {

    let body = req.fields;
    if (!body.planId) {

        return ReE(res, 'Plan id missing.', 422);

    } else if (!body.term_id) {

        return ReE(res, 'Please Select Term', 422);

    } else if (!body.title) {

        return ReE(res, 'Please Enter plan title', 422);

    } else if (!body.amount) {

        return ReE(res, 'Please Enter plan amount', 422);

    } else if (!body.amountUSD) {

        return ReE(res, 'Please Enter plan amount', 422);

    } else if (!body.emailSubject) {

        return ReE(res, 'Please Enter email subject.', 422);

    } else if (!body.emailContent) {

        return ReE(res, 'Please Enter email content.', 422);

    } else {

        let plan = {

            account_id: req.user.id,
            term_id : body.term_id,
            plan_title: body.title,
            plan_amount: body.amount,
            plan_amount_usd: body.amountUSD,
            subject_title: body.emailSubject,
            mail_content: body.emailContent,
            update_ip: req.ip

        };

        [err, plan] = await to(planService.editPlan(body.planId , plan));
        if (err) return ReE(res, err, 422);

        if (plan.length == 1 && plan[0] == 1){

            const planId = body.planId;

            [err, plan] = await to(planService.deletePlanPermissions(planId));
            if (err) return ReE(res, err, 422);

            var arrAllPermissionJson = [];
            await Promise.all(body.menuPermission.map(async (menuPermission) => {
    
                const permissionJson = {

                    plan_id: planId,
                    menuPermissions: menuPermission.selectedMenuId,
                    subMenuPermissions: menuPermission.selectedSubMenuId,
                    create_ip: req.ip
                };

                arrAllPermissionJson.push(permissionJson)
            }));

            [err, plan] = await to(planService.addPlanPermissions(arrAllPermissionJson));
            if (err) return ReE(res, err, 422);
            
            [err, plan] = await to(planService.getPlan(planId));
            
            return ReS(res, 'Plan Updated Successfully.', plan);

        } else {

            return ReE(res, 'Failed to update plan. please try again.', 422);
        }
    }
}
module.exports.editPlan = editPlan;

// Get Plan List
const getPlanList = async function (req, res) {

    [err, planList] = await to(planService.getPlanList(req.user.id));
    if (err) return ReE(res, err, 422);
    if(planList.length == 0){

        return ReE(res, 'Term List Get Successfully.', 204);
    } else {

        return ReS(res, 'Plan List Get Successfully.', planList);
    }
};
module.exports.getPlanList = getPlanList;

// Delete Plan
const deletePlan = async function (req, res) {


    if (!req.params.id) {

        return ReE(res, 'Plan id missing.', 422);
    }
    else {

        let plan = { delete: 1, update_ip: req.ip };

        [err, plan] = await to(planService.editPlan(req.params.id , plan));
        if (err) return ReE(res, err, 422);

        if (plan.length == 1 && plan[0] == 1){

            return ReS(res, 'Plan Deleted Successfully.', null);

        } else {

            return ReE(res, 'Failed to delete plan. please try again.', 422);
        }
    }
}
module.exports.deletePlan = deletePlan;

// ==================================================== Plan ========================================================
// ==================================================================================================================
// ==================================================== Plan Detail =================================================

// Add New Plan Detail
const createPlanDetail = async function (req, res) {

    let body = req.fields;

    if (!body.term_id) {

        return ReE(res, 'Please Select Term', 422);

    } else if (!body.plan_id) {

        return ReE(res, 'Please Select Plan', 422);

    } else if (!body.title) {

        return ReE(res, 'Please Enter plan detail title', 422);

    } else {


        let planDetail = {

            account_id: req.user.id,
            term_id : body.term_id,
            plan_id : body.plan_id,
            plan_detail_title: body.title,
            create_ip: req.ip

        };

        [err, planDetail] = await to(planService.createPlanDetail(planDetail));
        if (err) return ReE(res, err, 422);
        if (planDetail) {

            [err, planDetail] = await to(planService.getPlanDetail(planDetail.toJSON().plan_detail_id));
            return ReS(res, 'Plan Detail Added Successfully.', planDetail);

        } else {

            return ReE(res, 'Failed to add plan detail. please try again.', 422);
        }
    }


}
module.exports.createPlanDetail = createPlanDetail;

// Add New Plan Detail
const editPlanDetail = async function (req, res) {

    let body = req.fields;

    if (!body.planDetailId) { 

        return ReE(res, 'Plan Detail id missing.', 422);

    } else if (!body.term_id) {

        return ReE(res, 'Please Select Term', 422);

    } else if (!body.plan_id) {

        return ReE(res, 'Please Select Plan', 422);

    } else if (!body.title) {

        return ReE(res, 'Please Enter plan detail title', 422);

    } else {


        let planDetail = {

            account_id: req.user.id,
            term_id : body.term_id,
            plan_id : body.plan_id,
            plan_detail_title: body.title,
            update_ip: req.ip

        };

        [err, planDetail] = await to(planService.editPlanDetail(body.planDetailId,planDetail));
        if (err) return ReE(res, err, 422);
        if (planDetail.length == 1 && planDetail[0] == 1) {

            [err, planDetail] = await to(planService.getPlanDetail(body.planDetailId));
            return ReS(res, 'Plan Detail Updated Successfully.', planDetail);

        } else {

            return ReE(res, 'Failed to update plan detail. please try again.', 422);
        }
    }
}
module.exports.editPlanDetail = editPlanDetail;

// Get Plan List Detail
const getPlanDetailList = async function (req, res) {

    [err, planList] = await to(planService.getPlanDetailList(req.user.id));
    if (err) return ReE(res, err, 422);
    if(planList.length == 0){

        return ReE(res, 'Term List Get Successfully.', 204);
    } else {
        
        return ReS(res, 'Plan Detail List Get Successfully.', planList);
    }
};
module.exports.getPlanDetailList = getPlanDetailList;

// Delete Plan Detail
const deletePlanDetail = async function (req, res) {

    if (!req.params.id) { 

        return ReE(res, 'Plan Detail id missing.', 422);

    } else {

        let planDetail = { delete: 1, update_ip: req.ip };

        [err, planDetail] = await to(planService.editPlanDetail(req.params.id,planDetail));
        if (err) return ReE(res, err, 422);
        if (planDetail.length == 1 && planDetail[0] == 1) {


            return ReS(res, 'Plan Detail Deleted Successfully.', null);

        } else {

            return ReE(res, 'Failed to delete plan detail. please try again.', 422);
        }
    }
}
module.exports.deletePlanDetail = deletePlanDetail;
// ==================================================== Plan Detail =================================================
// ==================================================================================================================


//Get Terms and plans Which are added by super admin for ins.
const getTermsAndPlanList = async function (req, res) {

    [err, list] = await to(planService.getAllTermsAndPlan());
    if (err) return ReE(res, err, 422);
    
    if(list.length == 0){

        return ReS(res, 'All data get successfully.', 204);
        
    } else {

        return ReS(res, 'All data get successfully.', list);
    }
}
module.exports.getTermsAndPlanList = getTermsAndPlanList;