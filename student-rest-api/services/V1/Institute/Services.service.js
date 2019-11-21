const { TOA_country, TOA_SMS_plans } = require('../../../models');
const { to, TE } = require('../util.service');
const models = require('../../../models');

module.exports.getSMSPlanList = async function (type) {

    [err, smsPlanList] = await to(TOA_SMS_plans.findAll({
        where: {planType : type , delete: 0 },
        order: [['id', 'DESC']],
        attributes: ['id', 'title', 'planType', 'totalCount', 'amount', 'amountUSD'],
        include: [
            {
                model: TOA_country,
                as: 'country',
                where: { delete: 0, status: 0 },
                attributes: ['id', 'title'],
            }
        ]
    }));
    if (err) TE(err.message);
    return smsPlanList;
}