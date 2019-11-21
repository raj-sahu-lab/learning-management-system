const { TOA_term,TOA_plan,TOA_plan_detail , TOA_Tutor_menu_plan_permission } = require('../../../models');
const { to, TE } = require('../util.service');



// Get all terms and plan list
const getAllTermsAndPlan = async function () {

    [err, users] = await to(TOA_term.findAll(
       {
        where: { status: 0, delete :0 },
        attributes: [['term_id','id'], ['term_title', 'title']],

        include:[{

            model: TOA_plan,
            where: { status: 0, delete :0 },
            as: 'plan',
            attributes: [['plan_id','id'], ['plan_title','title']],
            required: false,
          }]
       }
    ));
    if (err) TE(err.message);
    return users;
}
module.exports.getAllTermsAndPlan = getAllTermsAndPlan;


// ==================================================== Term ========================================================
// Creating new term
const createTerm = async function (termInfo) {

    [err, term] = await to(TOA_term.create(termInfo));
    if (err) TE(err.message);
    if (!term) TE('Failed to create term please try again');

    return term;
}
module.exports.createTerm = createTerm;

// Edit current term
const editTerm = async function (termId, termInfo) {

    [err, term] = await to(TOA_term.update(termInfo , { where : {term_id : termId}}));
    if (err) TE(err.message);
    return term;
}
module.exports.editTerm = editTerm;

//Get Particuler Term
const getTerm = async function (termId) {

    [err, term] = await to(TOA_term.findOne({

        where: { term_id: termId, delete: 0, status :0 },
        order: [['term_id', 'DESC']],
        attributes: [['term_id', 'id'], ['term_title', 'title'], ['term_month', 'month'], ['term_days', 'days'], 'status'  , 'updatedAt'],

    }));
    if(err) TE(err.message);
    return term;
}
module.exports.getTerm = getTerm;

// Get All Term List
const getTermList = async function (user_id) {

    [err, termList] = await to(TOA_term.findAll({

        where: { account_id: user_id, delete: 0, status :0 },
        order: [['term_id', 'DESC']],
        attributes: [['term_id', 'id'], ['term_title', 'title'], ['term_month', 'month'], ['term_days', 'days'], 'status' ,'updatedAt'],

    }));
    if (err) TE(err.message);
    return termList;
}
module.exports.getTermList = getTermList;

// ==================================================== Term ========================================================

// ==================================================== Plan ========================================================

// Create new plan
const createPlan = async function (planInfo) {

    [err, plan] = await to(TOA_plan.create(planInfo));
    if (err) TE(err.message);
    return plan;
}
module.exports.createPlan = createPlan;


// Edit the current plan
const editPlan = async function (planId,planInfo) {

    [err, plan] = await to(TOA_plan.update(planInfo , { where : {plan_id : planId}}));
    if (err) TE(err.message);
    return plan;
}
module.exports.editPlan = editPlan;


// Get Particuler Plan
const getPlan = async function (planId) {

    [err, plan] = await to(TOA_plan.findOne({

        where: { plan_id: planId ,delete: 0, status: 0 },
        order: [['plan_id', 'DESC']],
        attributes: [['plan_id', 'id'], ['plan_title', 'title'], ['plan_amount', 'amount'], ['plan_amount_usd' , 'amountUSD'],'subject_title', 'mail_content','status' , 'razerPayPlanId'],
        include:[{

            model: TOA_term,
            where: { status: 0, delete :0 },
            as: 'term',
            attributes: [['term_id','id'], ['term_title','title']],
          },
          {

            model: TOA_Tutor_menu_plan_permission,
            as: 'planPermissions',
            attributes: ['menuPermissions','subMenuPermissions'],
          }
    ]
    }));
    if(err) TE(err.message);
    return plan;
}
module.exports.getPlan = getPlan;


module.exports.getPlanByPlanId = async function (razerPayPlanId) {

    [err, plan] = await to(TOA_plan.findOne({

        where: { razerPayPlanId: razerPayPlanId ,delete: 0, status: 0 },
        order: [['plan_id', 'DESC']],
        attributes: [['plan_id', 'id'], ['plan_title', 'title'], ['plan_amount', 'amount'], ['plan_amount_usd' , 'amountUSD'],'subject_title', 'mail_content','status' , 'razerPayPlanId'],
        include:[{

            model: TOA_term,
            where: { status: 0, delete :0 },
            as: 'term',
            attributes: [['term_id','id'], ['term_title','title']],
          },
          {

            model: TOA_Tutor_menu_plan_permission,
            as: 'planPermissions',
            attributes: ['menuPermissions','subMenuPermissions'],
          }
    ]
    }));
    if(err) TE(err.message);
    return plan;
}
// Get Plan List
const getPlanList = async function (user_id) {

    [err, termList] = await to(TOA_plan.findAll({

        where: { account_id: user_id, delete: 0, status :0 },
        order: [['plan_id', 'DESC']],
        attributes: [['plan_id', 'id'], ['plan_title', 'title'], ['plan_amount', 'amount'], ['plan_amount_usd' , 'amountUSD'],'subject_title', 'razerPayPlanId' , 'mail_content','status'],    
        include:[{

            model: TOA_term,
            where: { status: 0, delete :0 },
            as: 'term',
            attributes: [['term_id','id'], ['term_title','title']],
          },
          {

            model: TOA_Tutor_menu_plan_permission,
            as: 'planPermissions',
            attributes: ['menuPermissions','subMenuPermissions'],
          }]

    }));
    if (err) TE(err.message);
    return termList;
}
module.exports.getPlanList = getPlanList;


// ==================================================== Plan Detail ========================================================

// Add Plan Detail
const createPlanDetail = async function (planInfo) {

    [err, planDetail] = await to(TOA_plan_detail.create(planInfo));
    if (err) TE(err.message);
    
    return planDetail;
}
module.exports.createPlanDetail = createPlanDetail;

// Edit Plan Detail
const editPlanDetail = async function (planDetailId , planInfo) {

    [err, planDetail] = await to(TOA_plan_detail.update(planInfo , { where : {plan_detail_id : planDetailId}}));
    if (err) TE(err.message);

    return planDetail;
}
module.exports.editPlanDetail = editPlanDetail;

// Get Particuler plan detail
const getPlanDetail = async function (planDetailId) {

    [err, planDetail] = await to(TOA_plan_detail.findOne({

        where: { plan_detail_id: planDetailId ,delete: 0, status :0 },
        order: [['plan_id', 'DESC']],
        attributes: [['plan_detail_id','id'], ['plan_detail_title', 'title'], 'status'],
        include:[{

            model: TOA_term,
            where: { status: 0, delete :0 },
            as: 'term',
            attributes: [['term_id','id'], ['term_title','title']],
          },
          {

            model: TOA_plan,
            where: { status: 0, delete :0 },
            as: 'plan',
            attributes: [['plan_id','id'], ['plan_title','title']],
          }]
    }));
    if (err) TE(err.message);
    
    return planDetail;
}
module.exports.getPlanDetail = getPlanDetail;

// Get Plan Detail
const getPlanDetailList = async function (user_id) {

    [err, termList] = await to(TOA_plan_detail.findAll({

        where: { account_id: user_id, status: 0, delete :0 },
        order: [['plan_id', 'DESC']],
        attributes: [['plan_detail_id','id'], ['plan_detail_title', 'title'], 'status'],
        include:[{

            model: TOA_term,
            where: { status: 0, delete :0 },
            as: 'term',
            attributes: [['term_id','id'], ['term_title','title']],
          },
          {

            model: TOA_plan,
            where: { status: 0, delete :0 },
            as: 'plan',
            attributes: [['plan_id','id'], ['plan_title','title']],
          }]
    }));
    if (err) TE(err.message);
    return termList;
}
module.exports.getPlanDetailList = getPlanDetailList;


// ==================================================== Plan Permission ========================================================

module.exports.addPlanPermissions = async function (planPermissionListJson) {

    [err, permissionList] = await to(TOA_Tutor_menu_plan_permission.bulkCreate(planPermissionListJson));
    if (err) TE(err.message);
    return permissionList;
}


module.exports.deletePlanPermissions = async function (planId) {

    [err, permissionList] = await to(TOA_Tutor_menu_plan_permission.destroy(
        {
            where: { plan_id : planId }
        }
    ));
    if (err) TE(err.message);
    return permissionList;
}



