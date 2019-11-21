const { TOA_currency } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.addCurrency = async function (currencyInfo) {

    [err, currency] = await to(TOA_currency.create(currencyInfo));
    if (err) TE(err.message);
    return currency;
}

// Update Currency
module.exports.updateCurrency = async function (currencyId, currencyInfo) {

    [err, currency] = await to(TOA_currency.update(currencyInfo, { where: { id: currencyId } }));
    if (err) TE(err.message);
    return currency;
}

module.exports.getCurrencyList = async function () {

    
    [err, currencyList] = await to(TOA_currency.findAll({
        where: { delete: 0 },
        order: [['title', 'ASC']],
        attributes: [ 'id', 'title' ,'sign' , 'code', 'status'],
    }));
    if (err) TE(err.message);
    return currencyList;

}


module.exports.getCurrency = async function (currencyId) {

    [err, currency] = await to(TOA_currency.findOne({
        where: { id: currencyId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' ,'sign' , 'code', 'status'],
    }));
    if (err) TE(err.message);
    return currency;
}

module.exports.deleteCurrency  = async function (currencyId) {

    const currencyJson = {delete: 1};
    [err, currency] = await to(TOA_currency.update(currencyJson, { where: {id: currencyId } }));
    if (err) TE(err.message);
    return currency;

}
