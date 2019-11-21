const forumService = require('../../../services/V1/Institute/forum.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');


module.exports.getForumCount = async function (req, res) {

    const accountId = req.user.account_id;


    [err, categoryCount] = await to(forumService.getForumCategoryCount(accountId));
    if (err) return ReE(res, err, 422);

    [err, subjectCount] = await to(forumService.getForumSubjectCount(accountId));
    if (err) return ReE(res, err, 422);

    [err, topicCount] = await to(forumService.getForumTopicCount(accountId));
    if (err) return ReE(res, err, 422);


    [err, articleCount] = await to(forumService.getForumArticleCount(accountId));
    if (err) return ReE(res, err, 422);

    const reaponseJSON = {
        categoryTotal: categoryCount,
        subjectTotal: subjectCount,
        topicTotal: topicCount,
        articleTotal: articleCount
    };
    return ReS(res, 'All Forum List Got Successfully.', reaponseJSON);
}


module.exports.getForumList = async function (req, res) {

    [err, forumList] = await to(forumService.getForumList(req.user.account_id));
    if (err) return ReE(res, err, 422);


    if (forumList.length == 0) {

        return ReE(res, 'Forum Not Available', 204);

    } else {

        return ReS(res, 'All Forum List Got Successfully.', forumList);
    }


}



// ============================ Forum Category ============================
// Add Forum Category
module.exports.addForumCategory = async function (req, res) {

    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        const forumCategoryBody = {

            account_id: req.user.account_id,
            title: body.title,
            create_ip: req.ip,
        };

        [err, forumCategory] = await to(forumService.addForumCategory(forumCategoryBody));
        if (err) return ReE(res, err, 422);

        if (forumCategory) {

            [err, forumCategory] = await to(forumService.getForumCategory(forumCategory.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Forum Category added successfully.', forumCategory);

        } else {

            return ReE(res, 'Failed to add Forum Category, please try again.', 422);
        }
    }
}

// Get All Forum Category List
module.exports.getForumCategoryList = async function (req, res) {

    [err, forumCategoryList] = await to(forumService.getForumCategoryList(req.user.account_id));
    if (err) return ReE(res, err, 422);


    if (forumCategoryList.length == 0) {

        return ReE(res, 'Forum Categorys Not Available', 204);

    } else {

        return ReS(res, 'All Forum Category List Got Successfully.', forumCategoryList);
    }


}

// Update Forum Category
module.exports.updateForumCategory = async function (req, res) {

    const body = req.fields;
    if (!body.forumCategoryId) {

        return ReE(res, 'Please enter Forum Category id.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let forumCategoryBody = {

            title: body.title,
            update_ip: req.ip,

        };

        if (body.status) {

            forumCategoryBody.status = body.status
        }

        [err, forumCategory] = await to(forumService.updateForumCategory(body.forumCategoryId, forumCategoryBody));
        if (err) return ReE(res, err, 422);

        if (forumCategory.length === 1 && forumCategory[0] == 1) {

            [err, forumCategory] = await to(forumService.getForumCategory(body.forumCategoryId));
            return ReS(res, 'Forum Category updated successfully.', forumCategory);

        } else {

            return ReE(res, 'Failed to update Forum Category, please try again.', 422);
        }
    }
}

// Delete Forum Category
module.exports.deleteForumCategory = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Forum Category id missing.');

    } else {

        [err, forumCategory] = await to(forumService.deleteForumCategory(req.params.id));
        if (err) return ReE(res, err, 422);
        if (forumCategory.length === 1 && forumCategory[0] == 1) {

            return ReS(res, 'Forum Category deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete Forum Category. please try again.');
        }
    }
}



// ============================ Forum Subject ============================

// Add Forum Subject
module.exports.addForumSubject = async function (req, res) {

    const body = req.fields;


    if (!body.categoryId) {

        return ReE(res, 'Please select category.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        const forumSubjectBody = {

            category_id: body.categoryId,
            account_id: req.user.account_id,
            title: body.title,
            description: body.description,
            create_ip: req.ip,
        };

        [err, forumSubject] = await to(forumService.addForumSubject(forumSubjectBody));
        if (err) return ReE(res, err, 422);

        if (forumSubject) {

            [err, forumSubject] = await to(forumService.getForumSubject(forumSubject.id, req.user.account_id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Forum Subject added successfully.', forumSubject);

        } else {

            return ReE(res, 'Failed to add Forum Subject, please try again.', 422);
        }
    }
}

// Get All Forum Subject List
module.exports.getForumSubjectList = async function (req, res) {

    [err, forumSubjectList] = await to(forumService.getForumSubjectList(req.user.account_id));
    if (err) return ReE(res, err, 422);


    if (forumSubjectList.length == 0) {

        return ReE(res, 'Forum Subjects Not Available', 204);

    } else {

        return ReS(res, 'All Forum Subject List Got Successfully.', forumSubjectList);
    }


}

// Update Forum Subject
module.exports.updateForumSubject = async function (req, res) {

    const body = req.fields;
    if (!body.forumSubjectId) {

        return ReE(res, 'Please enter Forum Subject id.', 422);

    } else if (!body.categoryId) {

        return ReE(res, 'Please select category.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        let forumSubjectBody = {

            category_id: body.categoryId,
            account_id: req.user.account_id,
            title: body.title,
            description: body.description,
            update_ip: req.ip,

        };

        if (body.status) {

            forumSubjectBody.status = body.status
        }

        [err, forumSubject] = await to(forumService.updateForumSubject(body.forumSubjectId, forumSubjectBody));
        if (err) return ReE(res, err, 422);

        if (forumSubject.length === 1 && forumSubject[0] == 1) {

            [err, forumSubject] = await to(forumService.getForumSubject(body.forumSubjectId, req.user.account_id));
            return ReS(res, 'Forum Subject updated successfully.', forumSubject);

        } else {

            return ReE(res, 'Failed to update Forum Subject, please try again.', 422);
        }
    }
}

// Delete Forum Subject
module.exports.deleteForumSubject = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Forum Subject id missing.');

    } else {

        [err, forumSubject] = await to(forumService.deleteForumSubject(req.params.id));
        if (err) return ReE(res, err, 422);
        if (forumSubject.length === 1 && forumSubject[0] == 1) {

            return ReS(res, 'Forum Subject deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete Forum Subject. please try again.');
        }
    }
}


// ============================ Forum Topic ============================

// Add Forum Topic
module.exports.addForumTopic = async function (req, res) {

    const body = req.fields;


    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        const forumTopicBody = {

            subject_id: body.subjectId,
            account_id: req.user.account_id,
            title: body.title,
            description: body.description,
            create_ip: req.ip,
        };

        [err, forumTopic] = await to(forumService.addForumTopic(forumTopicBody));
        if (err) return ReE(res, err, 422);

        if (forumTopic) {

            [err, forumTopic] = await to(forumService.getForumTopic(forumTopic.id, req.user.account_id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Forum Topic added successfully.', forumTopic);

        } else {

            return ReE(res, 'Failed to add Forum Topic, please try again.', 422);
        }
    }
}

// Get All Forum Topic List
module.exports.getForumTopicList = async function (req, res) {

    [err, forumTopicList] = await to(forumService.getForumTopicList(req.user.account_id));
    if (err) return ReE(res, err, 422);


    if (forumTopicList.length == 0) {

        return ReE(res, 'Forum Topics Not Available', 204);

    } else {

        return ReS(res, 'All Forum Topic List Got Successfully.', forumTopicList);
    }


}

// Update Forum Topic
module.exports.updateForumTopic = async function (req, res) {

    const body = req.fields;
    if (!body.forumTopicId) {

        return ReE(res, 'Please enter Forum Topic id.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        let forumTopicBody = {

            subject_id: body.subjectId,
            account_id: req.user.account_id,
            title: body.title,
            description: body.description,
            update_ip: req.ip,

        };

        if (body.status) {

            forumTopicBody.status = body.status
        }

        [err, forumTopic] = await to(forumService.updateForumTopic(body.forumTopicId, forumTopicBody));
        if (err) return ReE(res, err, 422);

        if (forumTopic.length === 1 && forumTopic[0] == 1) {

            [err, forumTopic] = await to(forumService.getForumTopic(body.forumTopicId, req.user.account_id));
            return ReS(res, 'Forum Topic updated successfully.', forumTopic);

        } else {

            return ReE(res, 'Failed to update Forum Topic, please try again.', 422);
        }
    }
}

// Delete Forum Topic
module.exports.deleteForumTopic = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Forum Topic id missing.');

    } else {

        [err, forumTopic] = await to(forumService.deleteForumTopic(req.params.id));
        if (err) return ReE(res, err, 422);
        if (forumTopic.length === 1 && forumTopic[0] == 1) {

            return ReS(res, 'Forum Topic deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete Forum Topic. please try again.');
        }
    }
}


// ============================ Forum Articles ============================

// Add Forum Articles
module.exports.addForumArticles = async function (req, res) {

    const body = req.fields;


    if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.tutorId) {

        return ReE(res, 'Please select tutor.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        const forumArticlesBody = {

            topic_id: body.topicId,
            tutor_id: body.tutorId,
            account_id: req.user.account_id,
            title: body.title,
            description: body.description,
            create_ip: req.ip,
        };

        [err, forumArticles] = await to(forumService.addForumArticles(forumArticlesBody));
        if (err) return ReE(res, err, 422);

        if (forumArticles) {

            [err, forumArticles] = await to(forumService.getForumArticles(forumArticles.id, req.user.account_id));
            if (forumArticles) {

                var forumArticlesJSON = forumArticles.toJSON();
                forumArticlesJSON.author.image = await GetSignUrl(forumArticlesJSON.author.image);
                return ReS(res, 'Forum Articles added successfully.', forumArticlesJSON);

            } else {

                return ReS(res, 'Forum Articles added successfully.');
            }
        } else {

            return ReE(res, 'Failed to add Forum Articles, please try again.', 422);
        }
    }
}

// Get All Forum Articles List
module.exports.getForumArticlesList = async function (req, res) {

    [err, forumTopicList] = await to(forumService.getForumArticlesList(req.user.account_id));
    if (err) return ReE(res, err, 422);


    if (forumTopicList.length == 0) {

        return ReE(res, 'Forum Articless Not Available', 204);

    } else {

        var articlerSignedList = [];

        await Promise.all(forumTopicList.map(async (article) => {

            var article = article.toJSON();
            article.author.image = await GetSignUrl(article.author.image);
            articlerSignedList.push(article);
        }));

        return ReS(res, 'All Forum Articles List Got Successfully.', articlerSignedList);
    }


}

// Update Forum Articles
module.exports.updateForumArticles = async function (req, res) {

    const body = req.fields;
    if (!body.forumArticlesId) {

        return ReE(res, 'Please enter Forum Articles id.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.tutorId) {

        return ReE(res, 'Please select tutor.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {

        let forumArticlesBody = {

            topic_id: body.topicId,
            account_id: req.user.account_id,
            tutor_id: body.tutorId,
            title: body.title,
            description: body.description,
            update_ip: req.ip,

        };

        if (body.status) {

            forumArticlesBody.status = body.status
        }

        [err, forumArticles] = await to(forumService.updateForumArticles(body.forumArticlesId, forumArticlesBody));
        if (err) return ReE(res, err, 422);

        if (forumArticles.length === 1 && forumArticles[0] == 1) {

            [err, forumArticles] = await to(forumService.getForumArticles(body.forumArticlesId, req.user.account_id));
            if (forumArticles) {

                var forumArticlesJSON = forumArticles.toJSON();
                forumArticlesJSON.author.image = await GetSignUrl(forumArticlesJSON.author.image);
                return ReS(res, 'Forum Articles updated successfully.', forumArticlesJSON);

            } else {

                return ReS(res, 'Forum Articles updated successfully.');
            }
        } else {

            return ReE(res, 'Failed to update Forum Articles, please try again.', 422);
        }
    }
}

// Delete Forum Articles
module.exports.deleteForumArticles = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Forum Articles id missing.');

    } else {

        [err, forumArticles] = await to(forumService.deleteForumArticles(req.params.id));
        if (err) return ReE(res, err, 422);
        if (forumArticles.length === 1 && forumArticles[0] == 1) {

            return ReS(res, 'Forum Articles deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete Forum Articles. please try again.');
        }
    }
}





// Get Article Discussion

module.exports.getArticleDiscussion = async function (req, res) {

    const body = req.fields;

    if (!body.articleid) {

        return ReE(res, 'Please enter Forum Articles id.', 422);

    } else {

        [err, forumArticleList] = await to(forumService.getArticleDiscussion(body.articleid));
        if (err) return ReE(res, err, 422);

        if (forumArticleList.length == 0) {

            return ReE(res, 'Forum Article Discussion Not Available', 204);

        } else {

            var messageSignedList = [];

            var mList = forumArticleList.reverse();

            for (const message of mList) {

                let messageJson = message.toJSON();

                if (messageJson.student && messageJson.student.image) {

                    messageJson.student.image = await GetSignUrl(messageJson.student.image);
                }

                if (messageJson.reply && messageJson.reply.length > 0) {
                    for (let i = 0; i < messageJson.reply.length; i++) {
                        messageJson.reply[i].student.image = await GetSignUrl(messageJson.reply[i].student.image);
                    }

                }

                messageSignedList.push(messageJson);
            }

            [err, forumArticleId] = await to(forumService.getForumArticleById(body.articleid));
            if (err) return ReE(res, err, 422);

            let values = { article: forumArticleId, data: messageSignedList }

            return ReS(res, 'All Forum Discussion List Got Successfully.', values);
        }

    }

}



//deleteArticleDiscussionReply

module.exports.deleteArticleDiscussionReply = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Message id missing.');

    } else {

        [err, message] = await to(forumService.deleteArticleDiscussionReply(req.params.id));
        if (err) return ReE(res, err, 422);
        if (message.length === 1 && message[0] == 1) {

            return ReS(res, 'Message deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete message. please try again.');
        }
    }
}