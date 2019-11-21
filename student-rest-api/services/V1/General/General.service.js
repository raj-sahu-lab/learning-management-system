const { TOA_country, TOA_city , TOA_liveclass_api_key} = require('../../../models');
const { to, TE } = require('../util.service');


module.exports.countryCityList = async function () {

    [err, countryCityList] = await to(TOA_country.findAll({

        where: { delete: 0 , status: 0},
        attributes: ['id', 'title' , 'code'],
        order: [['title', 'ASC'] , [ { model: TOA_city,as: 'citys' } , 'title' , 'ASC']],
        include: [
        {
            model: TOA_city,
            as: 'citys',
            where: { delete: 0 , status: 0},
            attributes: ['id','title'],
            required: false
        }]
    }));
    if (err) TE(err.message);
    return countryCityList;
}


module.exports.getLiveClassKeys = async function(branchId){

    [err,liveClassKeyList] = await to(TOA_liveclass_api_key.findAll({

        where: { delete: 0 , status: 0 , branch_id : branchId},
        attributes: ['id', ['branch_id', 'branchId'], ['liveclass_type' , 'type'], ['liveclass_apikey' , 'key'],['liveclass_apisecret', 'secret'], ['android_apikey' , 'androidkey'],['android_apisecret', 'androidSecret']]
    }));
    if (err) TE(err.message);
    return liveClassKeyList;
}