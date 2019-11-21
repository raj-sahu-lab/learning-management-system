const { TOA_forum_category, TOA_forum_subject , TOA_forum_topic , TOA_forum_articles, TOA_tutor} = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');

module.exports.getForumList = async function (instituteId) {

    
    [err, forumList] = await to(TOA_forum_category.findAll({
        where: { status:0, delete: 0, account_id: instituteId },
        attributes: [ 'id', 'title'],
        include:[
            {
                model: TOA_forum_subject,
                as: 'subjects',
                attributes: [ 'id', 'title'],
                required: false,
                where: { status:0, delete: 0},
                include:[
                    {
                        model: TOA_forum_topic,
                        as: 'topics',
                        attributes: [ 'id', 'title'],
                        required: false,
                        where: { status:0, delete: 0},
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumList;

}

// ============================ Forum Category ============================


// Get All List Of Forum Category
module.exports.getForumCategoryList = async function (instituteId) {

    
    [err, forumCategoryList] = await to(TOA_forum_category.findAll({
        where: { status:0, delete: 0, account_id: instituteId },
        attributes: [ 'id', 'title' ],
    }));
    if (err) TE(err.message);
    return forumCategoryList;

}

// ============================ Forum Subject ============================

// Get All List Of Forum Subject
module.exports.getForumSubjectList = async function (instituteId, categoryId) {


    [err, forumSubjectList] = await to(TOA_forum_category.findOne({
        where: { account_id: instituteId, id: categoryId, status:0, delete: 0 },
        attributes: [ 'id', 'title' ],
        group: ['subjects.id'],
        include:[
            {
                model: TOA_forum_subject,
                as: 'subjects',
                where: { status:0, delete: 0 },
                order: [['updatedAt', 'DESC']],
                attributes: [ 'id', 'title', 'description',[Sequelize.fn("COUNT", Sequelize.col("topic_id")), "articleCount"]],
                required: false,
                include:[
                    {
                        model: TOA_forum_topic,
                        as: 'topics',
                        where: {status:0, delete: 0 },
                        required: false,
                        attributes: [],
                        include: [{
                            model: TOA_forum_articles,
                            as: 'articals',
                            where: {status: 0, delete: 0 },
                            attributes: [],
                            required: false
                        }]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumSubjectList;

}


// ============================ Forum Topic ============================


// Get All List Of Forum Topic
module.exports.getForumTopicList = async function (instituteId , subjectId) {

    
    [err, forumTopicList] = await to(TOA_forum_subject.findOne({
        where: { account_id: instituteId, id: subjectId , status:0, delete: 0 },
        attributes: [ 'id', 'title', 'description'],
        group: ['topics.id'],
        include:[
            {
                model: TOA_forum_topic,
                as: 'topics',
                where: {status:0, delete: 0 },
                order: [['updatedAt', 'DESC']],
                attributes: [ 'id', 'title', 'description', [Sequelize.fn("COUNT", Sequelize.col("topic_id")), "articleCount"]],
                required: false,
                include:[
                    {
                        model: TOA_forum_articles,
                        as: 'articals',
                        where: {status: 0, delete: 0 },
                        attributes: [],
                        required: false
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumTopicList;

}


// ============================ Forum Articles ============================

// Get All List Of Forum Articles
module.exports.getForumArticlesList = async function (instituteId, topicId) {

    let whereClause =  { account_id: instituteId, status: 0, delete: 0 };

    if(topicId){

        whereClause.id = topicId;
    }

    [err, forumArticlesList] = await to(TOA_forum_topic.findOne({
        where: whereClause,
        attributes: [ 'id', 'title', 'description'],
        include:[
            {
                model: TOA_forum_articles,
                as: 'articals',
                where: { status:0, delete: 0 },
                order: [['updatedAt', 'DESC']],
                attributes: [ 'id', 'title', 'description' , ['createdAt' , 'publishedDate']],
                required: false,
                include:[
                    {
                        model: TOA_tutor,
                        as: 'author',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name'] , ['tutor_image' , 'image']],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumArticlesList;

}

// Get Particuler Forum Articles
module.exports.getForumArticles = async function (forumArticlesId , instituteId) {

    [err, forumArticles] = await to(TOA_forum_articles.findOne({
        where: {id: forumArticlesId, account_id: instituteId, status:0, delete: 0 },
        attributes: [ 'id', 'title', 'description' , ['createdAt' , 'publishedDate']],
        include:[
            {
                model: TOA_tutor,
                as: 'author',
                attributes: [['tutor_id', 'id'], ['tutor_name', 'name'] , ['tutor_image' , 'image']],
            }
        ]
    }));
    if (err) TE(err.message);
    return forumArticles;

}