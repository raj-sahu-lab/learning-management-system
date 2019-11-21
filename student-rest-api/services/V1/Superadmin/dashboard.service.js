const { TOA_student_purchase_detail, TOA_student, TOA_plan_purchase, TOA_currency, TOA_plan, TOA_term, TOA_account, TOA_email_management, TOA_campaign_sent, TOA_sms, TOA_sent_sms } = require('../../../models');
const { to, TE } = require('../util.service');
const models = require('../../../models');
const Sequelize = require('sequelize');
const moment = require('moment');


module.exports.getInstituteCount = async function () {

    [err, instituteCount] = await to(TOA_account.count({
        where: {
            status: 0,
            delete: 0
        }
    }));

    if (err) err;

    return instituteCount;

}
module.exports.getSMSCounts = async function () {

    [err, totalSmsCountByInstitute] = await to(TOA_sms.findAll({
        raw: true,
        attributes: [['institute_id', 'account_id'], [models.sequelize.fn('sum', models.sequelize.col('total_sms')), 'total_sms']],

        include: [
            {
                model: TOA_account,
                as: 'institute',
                where: { delete: 0, status: 0 },
                attributes: ['account_title'],
            }
        ],
        group: 'institute_id'
    }));
    totalSmsCountByInstitute = totalSmsCountByInstitute.map(item => {
        return {
            account_id: item.account_id,
            account_title: item['institute.account_title'],
            total_sms: item.total_sms

        };
    });

    [err, totalConsumedSmsCountByInst] = await to(TOA_sent_sms.findAll({
        raw: true,
        attributes: ['account_id', [models.sequelize.fn('GROUP_CONCAT', models.sequelize.col('sent_contacts')), 'consume_sms']],
        group: 'account_id'
    }));

    totalConsumedSmsCountByInst = totalConsumedSmsCountByInst.map(o => Object.assign({}, o, { consume_sms: ((o.consume_sms).split(',')).length.toString() })).map(o => Object.assign({}, o, { consume_sms: (o.consume_sms).toString() }))
    // totalConsumedSmsCountByInst = totalConsumedSmsCountByInst.map(o => Object.assign({}, o, {consume_sms: (o.consume_sms).toString()}))

    let smsDetails = totalSmsCountByInstitute.map((x) => { x.consume_sms = "0"; return Object.assign(x, totalConsumedSmsCountByInst.find(y => y.account_id == x.account_id)) });

    if (err) TE(err.message);
    return smsDetails;


}
module.exports.getEmailCounts = async function () {

    [err, totalEmailCountByInstitute] = await to(TOA_email_management.findAll({
        raw: true,
        attributes: [['institute_id', 'account_id'], [models.sequelize.fn('sum', models.sequelize.col('total_email')), 'total_email']],
        include: [
            {
                model: TOA_account,
                as: 'institute',
                where: { delete: 0, status: 0 },
                attributes: ['account_title'],
            }
        ],
        group: 'institute_id'
    }));


    totalEmailCountByInstitute = totalEmailCountByInstitute.map(item => {
        return {
            account_id: item.account_id,
            account_title: item['institute.account_title'],
            total_email: item.total_email
        };
    });

    [err, totalConsumedEmailCountByInst] = await to(TOA_campaign_sent.findAll({
        raw: true,
        attributes: ['account_id', [models.sequelize.fn('GROUP_CONCAT', models.sequelize.col('sent_emails')), 'consume_email']],
        group: 'account_id'
    }));
    totalConsumedEmailCountByInst = totalConsumedEmailCountByInst.map(o => Object.assign({}, o, { consume_email: ((o.consume_email).split(',')).length.toString() }))
    let emailDetails = totalEmailCountByInstitute.map((x) => { x.consume_email = "0"; return Object.assign(x, totalConsumedEmailCountByInst.find(y => y.account_id == x.account_id)) });

    if (err) TE(err.message);
    return emailDetails;
}
module.exports.getExpiredInstitutes = async function () {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    let notExpIds = [];

    [err, notExpInstitutes] = await to(TOA_plan_purchase.findAll({
        where: {
            delete: 0, status: 0,
            plan_edate: { [Sequelize.Op.gt]: today },
        },
        attributes: ['account_id'],
    }));

    notExpInstitutes = notExpInstitutes.map((item) => {
        notExpIds.push(item.dataValues.account_id)
    });


    [err, getExpInstitutesDetails] = await to(TOA_plan_purchase.findAll({
        where: {
            delete: 0, status: 0,
            plan_edate: { [Sequelize.Op.lt]: today },
            account_id: {
                [Sequelize.Op.notIn]: notExpIds
            }
        },
        order: [['plan_edate', 'DESC']],
        attributes: ['plan_sdate', 'plan_edate', 'plan_amount'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: ['account_title'],
            },
            {
                model: TOA_term,
                as: 'term',
                attributes: ['term_title'],
            },
            {
                model: TOA_plan,
                as: 'plan',
                attributes: ['plan_id', 'account_id', 'plan_title'],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['sign'],
            }
        ],
    }));

    if (err) TE(err.message);
    return getExpInstitutesDetails;
}
module.exports.getExpiredInstitutesInWeek = async function () {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    var week = new Date();
    week.setDate(week.getDate() + 7);
    var d = week.getDate();
    var m = week.getMonth() + 1;
    var y = week.getFullYear();
    if (d < 10) {
        d = '0' + d;
    }
    if (m < 10) {
        m = '0' + m;
    }
    week = y + '-' + m + '-' + d;

    [err, getInstitutesExpiresThisWeek] = await to(TOA_plan_purchase.findAll({
        where: { delete: 0, status: 0, plan_edate: { [Sequelize.Op.gte]: today, [Sequelize.Op.lt]: week } },
        order: [['plan_edate', 'DESC']],
        attributes: ['plan_sdate', 'plan_edate', 'plan_amount'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: ['account_title'],
            },
            {
                model: TOA_term,
                as: 'term',
                attributes: ['term_title'],
            },
            {
                model: TOA_plan,
                as: 'plan',
                attributes: ['plan_id', 'account_id', 'plan_title'],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['sign'],
            }
        ],
    }));

    if (err) TE(err.message);
    return getInstitutesExpiresThisWeek;
}

module.exports.getTotalRegistredStudents = async function (year) {
    const Gotyear = year;
    let regMonth = [];
    let month = 1;

    while (month < 13) {

        const currMonth = await TOA_student.findAndCountAll({
            attributes: ['createdAt'],
            where: {
                createdAt: {
                    [Sequelize.Op.gte]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month - 1, 'months').toDate(),
                    [Sequelize.Op.lt]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month, 'months').toDate(),
                }
            },
        })

        regMonth.push(currMonth);
        month++;
    }

    let months = [];
    let counts = [];

    regMonth.forEach(element => {
        if (element.count > 0) {
            months.push(moment(element.rows[0].dataValues.createdAt).format('MMMM YYYY'))
            counts.push(element.count)
        }
    });

    let result = { months: months, counts: counts }

    if (result == null) {
        result.push({})
    }

    return result;
}

module.exports.getTotalStudentIncome = async function (year, currency) {

    const Gotyear = year;
    const getcurrencyId = currency;

    let regMonth = [];
    let month = 1;


    while (month < 13) {

        const currMonth = await TOA_student_purchase_detail.findAll({
            attributes: ['id', 'purchase_id', 'amount', 'currencyId', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],],
            where: {
                currencyId: getcurrencyId,
                createdAt: {
                    [Sequelize.Op.gte]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month - 1, 'months').toDate(),
                    [Sequelize.Op.lt]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month, 'months').toDate(),
                }
            },
        })

        regMonth.push(currMonth);
        month++;
    }

    let months = [];
    let counts = [];

    regMonth = regMonth.map((item) => {
        if (item[0].dataValues.id != null) {
            months.push(moment(item[0].dataValues.createdAt).format('MMMM YYYY'))
            counts.push((item[0].dataValues.total_amount).toFixed(2))
        }
    })

    let result = { months: months, counts: counts }

    if (result == null) {
        result.push({})
    }

    return result;

}

module.exports.getTotalInstitutePurchase = async function (year, currency) {

    const Gotyear = year;
    const getcurrencyId = currency;

    let regMonth = [];
    let month = 1;

    while (month < 13) {

        const currMonth = await TOA_plan_purchase.findAll({
            attributes: ['plan_purchase_id', 'currencyType', 'plan_amount', 'createdAt', [Sequelize.fn('sum', Sequelize.col('plan_amount')), 'total_amount'],],
            where: {
                currencyType: getcurrencyId,
                createdAt: {
                    [Sequelize.Op.gte]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month - 1, 'months').toDate(),
                    [Sequelize.Op.lt]: moment(`0101${Gotyear}`, "MMDDYYYY").add(month, 'months').toDate(),
                }
            },
        })

        regMonth.push(currMonth);
        month++;
    }

    let months = [];
    let counts = [];

    regMonth = regMonth.map((item) => {
        if (item[0].dataValues.plan_purchase_id != null) {
            months.push(moment(item[0].dataValues.createdAt).format('MMMM YYYY'))
            counts.push(item[0].dataValues.total_amount)
        }
    })

    let result = { months: months, counts: counts }

    return result;

}