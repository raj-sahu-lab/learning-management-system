const { TOA_student, TOA_forum_discussion, TOA_forum_discussion_reply, TOA_forum_category, TOA_forum_subject, TOA_branch, TOA_tutor, TOA_forum_topic, TOA_forum_articles } = require('../../../models');
const { to, TE } = require('../util.service');


module.exports.getForumCategoryCount = async function (instituteId) {

    [err, count] = await to(TOA_forum_category.count({ where: { status: 0, delete: 0, account_id: instituteId } }));
    if (err) TE(err.message);
    return count;
}

module.exports.getForumSubjectCount = async function (instituteId) {

    [err, count] = await to(TOA_forum_subject.count({ where: { status: 0, delete: 0, account_id: instituteId } }));
    if (err) TE(err.message);
    return count;
}

module.exports.getForumTopicCount = async function (instituteId) {

    [err, count] = await to(TOA_forum_topic.count({ where: { status: 0, delete: 0, account_id: instituteId } }));
    if (err) TE(err.message);
    return count;
}


module.exports.getForumArticleCount = async function (instituteId) {

    [err, count] = await to(TOA_forum_articles.count({ where: { status: 0, delete: 0, account_id: instituteId } }));
    if (err) TE(err.message);
    return count;
}

module.exports.getForumList = async function (instituteId) {


    [err, forumList] = await to(TOA_forum_category.findAll({
        where: { status: 0, delete: 0, account_id: instituteId },
        attributes: ['id', 'title'],
        include: [
            {
                model: TOA_forum_subject,
                as: 'subjects',
                attributes: ['id', 'title'],
                required: false,
                where: { status: 0, delete: 0 },
                include: [
                    {
                        model: TOA_forum_topic,
                        as: 'topics',
                        attributes: ['id', 'title'],
                        required: false,
                        where: { status: 0, delete: 0 },
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumList;

}

// ============================ Forum Category ============================

// Add Forum Category
module.exports.addForumCategory = async function (forumCategoryInfo) {

    [err, forumCategory] = await to(TOA_forum_category.create(forumCategoryInfo));
    if (err) TE(err.message);
    return forumCategory;
}

// Update Forum Category
module.exports.updateForumCategory = async function (forumCategoryId, forumCategoryInfo) {

    [err, forumCategory] = await to(TOA_forum_category.update(forumCategoryInfo, { where: { id: forumCategoryId } }));
    if (err) TE(err.message);
    return forumCategory;
}

// Get All List Of Forum Category
module.exports.getForumCategoryList = async function (instituteId) {


    [err, forumCategoryList] = await to(TOA_forum_category.findAll({
        where: { delete: 0, account_id: instituteId },
        attributes: ['id', 'title', 'status'],
    }));
    if (err) TE(err.message);
    return forumCategoryList;

}

// Get Particuler Forum Category
module.exports.getForumCategory = async function (forumCategoryId, instituteId) {

    [err, forumCategory] = await to(TOA_forum_category.findOne({
        where: { id: forumCategoryId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'status'],
    }));
    if (err) TE(err.message);
    return forumCategory;

}

// Delete Forum Category
module.exports.deleteForumCategory = async function (forumCategoryId) {

    const forumCategoryInfo = { delete: 1 };
    [err, forumCategory] = await to(TOA_forum_category.update(forumCategoryInfo, { where: { id: forumCategoryId } }));
    if (err) TE(err.message);
    return forumCategory;

}

// ============================ Forum Subject ============================

// Add Forum Subject
module.exports.addForumSubject = async function (forumSubjectInfo) {

    [err, forumSubject] = await to(TOA_forum_subject.create(forumSubjectInfo));
    if (err) TE(err.message);
    return forumSubject;
}

// Update Forum Subject
module.exports.updateForumSubject = async function (forumSubjectId, forumSubjectInfo) {

    [err, forumSubject] = await to(TOA_forum_subject.update(forumSubjectInfo, { where: { id: forumSubjectId } }));
    if (err) TE(err.message);
    return forumSubject;
}

// Get All List Of Forum Subject
module.exports.getForumSubjectList = async function (instituteId) {


    [err, forumSubjectList] = await to(TOA_forum_subject.findAll({
        where: { account_id: instituteId, delete: 0 },
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_category,
                as: 'category',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title'],
            }
        ]
    }));
    if (err) TE(err.message);
    return forumSubjectList;

}

// Get Particuler Forum Subject
module.exports.getForumSubject = async function (forumSubjectId, instituteId) {

    [err, forumSubject] = await to(TOA_forum_subject.findOne({
        where: { id: forumSubjectId, account_id: instituteId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_category,
                as: 'category',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title'],
            }
        ]
    }));
    if (err) TE(err.message);
    return forumSubject;

}

// Delete Forum Subject
module.exports.deleteForumSubject = async function (forumSubjectId) {

    const forumSubjectInfo = { delete: 1 };
    [err, forumSubject] = await to(TOA_forum_subject.update(forumSubjectInfo, { where: { id: forumSubjectId } }));
    if (err) TE(err.message);
    return forumSubject;

}

// ============================ Forum Topic ============================

// Add Forum Topic
module.exports.addForumTopic = async function (forumTopicInfo) {

    [err, forumTopic] = await to(TOA_forum_topic.create(forumTopicInfo));
    if (err) TE(err.message);
    return forumTopic;
}

// Update Forum Topic
module.exports.updateForumTopic = async function (forumTopicId, forumTopicInfo) {

    [err, forumTopic] = await to(TOA_forum_topic.update(forumTopicInfo, { where: { id: forumTopicId } }));
    if (err) TE(err.message);
    return forumTopic;
}

// Get All List Of Forum Topic
module.exports.getForumTopicList = async function (instituteId) {


    [err, forumTopicList] = await to(TOA_forum_topic.findAll({
        where: { account_id: instituteId, delete: 0 },
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_subject,
                as: 'subject',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title', 'description', 'status'],
                include: [
                    {
                        model: TOA_forum_category,
                        as: 'category',
                        where: { account_id: instituteId, delete: 0 },
                        attributes: ['id', 'title'],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumTopicList;

}

// Get Particuler Forum Topic
module.exports.getForumTopic = async function (forumTopicId, instituteId) {

    [err, forumTopic] = await to(TOA_forum_topic.findOne({
        where: { id: forumTopicId, account_id: instituteId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_subject,
                as: 'subject',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title', 'description', 'status'],
                include: [
                    {
                        model: TOA_forum_category,
                        as: 'category',
                        where: { account_id: instituteId, delete: 0 },
                        attributes: ['id', 'title'],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumTopic;

}

// Delete Forum Topic
module.exports.deleteForumTopic = async function (forumTopicId) {

    const forumTopicInfo = { delete: 1 };
    [err, forumTopic] = await to(TOA_forum_topic.update(forumTopicInfo, { where: { id: forumTopicId } }));
    if (err) TE(err.message);
    return forumTopic;

}


// ============================ Forum Articles ============================

// Add Forum Articles
module.exports.addForumArticles = async function (forumArticlesInfo) {

    [err, forumArticles] = await to(TOA_forum_articles.create(forumArticlesInfo));
    if (err) TE(err.message);
    return forumArticles;
}

// Update Forum Articles
module.exports.updateForumArticles = async function (forumArticlesId, forumArticlesInfo) {

    [err, forumArticles] = await to(TOA_forum_articles.update(forumArticlesInfo, { where: { id: forumArticlesId } }));
    if (err) TE(err.message);
    return forumArticles;
}

// Get All List Of Forum Articles
module.exports.getForumArticlesList = async function (instituteId) {


    [err, forumArticlesList] = await to(TOA_forum_articles.findAll({
        where: { account_id: instituteId, delete: 0 },
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_topic,
                as: 'topic',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title', 'description', 'status'],
                include: [
                    {
                        model: TOA_forum_subject,
                        as: 'subject',
                        where: { account_id: instituteId, delete: 0 },
                        attributes: ['id', 'title', 'description', 'status'],
                        include: [
                            {
                                model: TOA_forum_category,
                                as: 'category',
                                where: { account_id: instituteId, delete: 0 },
                                attributes: ['id', 'title'],
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_tutor,
                as: 'author',
                attributes: [['tutor_id', 'id'], ['tutor_name', 'name'], ['tutor_image', 'image']],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumArticlesList;

}

// Get Particuler Forum Articles
module.exports.getForumArticles = async function (forumArticlesId, instituteId) {

    [err, forumArticles] = await to(TOA_forum_articles.findOne({
        where: { id: forumArticlesId, account_id: instituteId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'title', 'description', 'status'],
        include: [
            {
                model: TOA_forum_topic,
                as: 'topic',
                where: { account_id: instituteId, delete: 0 },
                attributes: ['id', 'title', 'description', 'status'],
                include: [
                    {
                        model: TOA_forum_subject,
                        as: 'subject',
                        where: { account_id: instituteId, delete: 0 },
                        attributes: ['id', 'title', 'description', 'status'],
                        include: [
                            {
                                model: TOA_forum_category,
                                as: 'category',
                                where: { account_id: instituteId, delete: 0 },
                                attributes: ['id', 'title'],
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_tutor,
                as: 'author',
                attributes: [['tutor_id', 'id'], ['tutor_name', 'name'], ['tutor_image', 'image']],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return forumArticles;

}

// Delete Forum Articles
module.exports.deleteForumArticles = async function (forumArticlesId) {

    const forumArticlesInfo = { delete: 1 };
    [err, forumArticles] = await to(TOA_forum_articles.update(forumArticlesInfo, { where: { id: forumArticlesId } }));
    if (err) TE(err.message);
    return forumArticles;

}


//Get forum article by id
module.exports.getForumArticleById = async function (articleId) {
    [err, forumArticle] = await to(TOA_forum_articles.findOne({
        where: { id: articleId },
        attributes: ['id', 'title', 'description'],
    }));
    if (err) TE(err.message);
    return forumArticle;
}


//Get article discussion
module.exports.getArticleDiscussion = async function (article_id) {

    [err, forumTopic] = await to(TOA_forum_discussion.findAll({
        where: { article_id: article_id, delete: 0 },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'message', 'delete', 'create_ip', 'update_ip', 'createdAt', 'updatedAt'],
        include: [
            {
                model: TOA_student,
                order: [['createdAt', 'DESC']],
                as: 'student',
                attributes: ['id', 'first_name', 'last_name', 'image'],
                order: [['createdAt', 'DESC']],
                required: false

            },
            {
                model: TOA_forum_discussion_reply,
                attributes: ['id', 'message', 'delete', 'create_ip', 'update_ip', 'createdAt', 'updatedAt'],
                where: { delete: 0 },
                as: 'reply',
                include: [
                    {
                        model: TOA_student,
                        as: 'student',
                        attributes: ['id', 'first_name', 'last_name', 'image'],
                        required: false

                    }
                ],
                required: false
            }
        ]
    }));

    if (err) TE(err.message);

    return forumTopic;
}


// Delete article discussion reply
module.exports.deleteArticleDiscussionReply = async function (messageId) {

    const messageJson = { delete: 1 };

    [err, message] = await to(TOA_forum_discussion_reply.update(messageJson, { where: { id: messageId } }));
    if (err) TE(err.message);
    return message;

}