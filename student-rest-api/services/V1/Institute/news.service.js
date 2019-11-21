const { TOA_news_category, TOA_news } = require('../../../models');
const { to, TE } = require('../util.service');


// ---------------------------------------------- News Category ---------------------------------------------- 

// Add New News Category
const addNewsCategory = async function (newsCategory) {

    [err, newsCategory] = await to(TOA_news_category.create(newsCategory));
    if (err) TE(err.message);
    return newsCategory;
}
module.exports.addNewsCategory = addNewsCategory;

// Update News Category
const updateNewsCategory = async function (newsCategoryId, newsCategoryInfo) {

    [err, newsCategory] = await to(TOA_news_category.update(newsCategoryInfo, { where: { id: newsCategoryId } }));
    if (err) TE(err.message);
    return newsCategory;
}
module.exports.updateNewsCategory = updateNewsCategory;

// Get All News Category List
const getNewsCategoryList = async function (user , isFiltered) {

    let arrayFields = ['id', 'title', 'image', 'description', 'status'];

    if(isFiltered){
        arrayFields = ['id', 'title'];
    }

    [err, newsCategoryList] = await to(TOA_news_category.findAll({
        where: { account_id: user.account_id,  delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: arrayFields
    }));
    if (err) TE(err.message);
    return newsCategoryList;

}
module.exports.getNewsCategoryList = getNewsCategoryList;

// Get Single News Category
const getNewsCategory = async function (accountId, newsCategoryId) {

    [err, newsCategory] = await to(TOA_news_category.findOne({

        where: { account_id: accountId, id: newsCategoryId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'image', 'description', 'status']
    }));
    if (err) TE(err.message);
    return newsCategory;

}
module.exports.getNewsCategory = getNewsCategory;

// Delete News Category
const deleteNewsCategory = async function (accountId, newsCategoryId) {

    const newsCategoryJson = {delete: 1};
    [err, newsCategory] = await to(TOA_news_category.update(newsCategoryJson, { where: { account_id: accountId, id: newsCategoryId } }));
    if (err) TE(err.message);
    return newsCategory;

}
module.exports.deleteNewsCategory = deleteNewsCategory;

// ---------------------------------------------- News Category ---------------------------------------------- 


// ---------------------------------------------- News ---------------------------------------------- 

// Add New News
const addNews = async function (newsInfo) {

    [err, news] = await to(TOA_news.create(newsInfo));
    if (err) TE(err.message);
    return news;
}
module.exports.addNews = addNews;

// Update News
const updateNews = async function (newsId, newsInfo) {

    [err, news] = await to(TOA_news.update(newsInfo, { where: { id: newsId } }));
    if (err) TE(err.message);
    return news;
}
module.exports.updateNews = updateNews;

// Get All News List
const getNewsList = async function (user) {

    [err, newsList] = await to(TOA_news.findAll({
        where: { account_id: user.account_id,  delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'image', 'description', ['news_datetime' , 'date'], 'status'],
        include: [{

            model: TOA_news_category,
            as: 'newsCategory',
            attributes: ['id', 'title'],
        }]
    }));
    if (err) TE(err.message);
    return newsList;

}
module.exports.getNewsList = getNewsList;

// Get Single News
const getNews = async function (accountId, newsId) {

    [err, news] = await to(TOA_news.findOne({

        where: { account_id: accountId, id: newsId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'image', 'description', ['news_datetime' , 'date'], 'status'],
        include: [{

            model: TOA_news_category,
            as: 'newsCategory',
            attributes: ['id', 'title'],
        }]
    }));
    if (err) TE(err.message);
    return news;

}
module.exports.getNews = getNews;

// Delete News
const deleteNews = async function (accountId, newsId) {

    const newsJson = {delete: 1};
    [err, news] = await to(TOA_news.update(newsJson, { where: { account_id: accountId, id: newsId } }));
    if (err) TE(err.message);
    return news;

}
module.exports.deleteNews = deleteNews;

// ---------------------------------------------- News ---------------------------------------------- 