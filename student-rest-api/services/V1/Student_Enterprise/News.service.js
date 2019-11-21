const { TOA_news_category, TOA_news } = require('../../../models');
const { to, TE } = require('../util.service');


// ---------------------------------------------- News Category ---------------------------------------------- 

// Get All News Category List
module.exports.getNewsCategoryList = async function (accountId) {

    [err, newsCategoryList] = await to(TOA_news_category.findAll({
        where: { account_id: accountId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'image', 'description']
    }));
    if (err) TE(err.message);
    return newsCategoryList;

}


// ---------------------------------------------- News Category ---------------------------------------------- 


// ---------------------------------------------- News ---------------------------------------------- 


// Get All News List
module.exports.getNewsList = async function (accountId, categoryId) {

    [err, newsList] = await to(TOA_news.findAll({
        where: { account_id: accountId, category_id: categoryId, status: 0, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'image', 'description', ['news_datetime', 'date']],
        include: [{

            model: TOA_news_category,
            as: 'newsCategory',
            where: { status: 0, delete: 0 },
            attributes: ['id', 'title'],
        }]
    }));
    if (err) TE(err.message);
    return newsList;

}


// ---------------------------------------------- News ---------------------------------------------- 