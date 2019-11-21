const { to, TE } = require('./util.service');
const { TOA_plan_purchase , TOA_account } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports.getActiveAccounts = async function(){

    [err, users] = await to(TOA_account.findAll({ 
        where: { delete: 0  },
        order: [['account_id', 'DESC']],
        // attributes: ['account_id' , 'account_image' , 'account_title' , 'countryCode' , 'pin_code' , 'account_phone' , 'account_email' , 'account_domain' , 'accessLevel' , 'status', ['is_marketplace_enable', 'isMarketplaceEnable'] , 'createdAt'],
        include: [
            {
                model: TOA_plan_purchase,
                as: 'purchaseList'
               
            }
        ]
    }));
    if (err) TE(err.message);
    return users;
}