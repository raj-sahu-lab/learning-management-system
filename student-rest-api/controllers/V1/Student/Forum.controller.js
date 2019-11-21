const forumService = require('../../../services/V1/Student/Forum.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');




module.exports.getForumDashBoard = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;
    
    [err, forumCategoryList] = await to(forumService.getForumCategoryList(accountId));
    if (err) return ReE(res, err, 422);

    [err, forumTopicList] = await to(forumService.getForumArticlesList(accountId));
    if (err) return ReE(res, err, 422);

    const responseJson = {

        category: forumCategoryList,
        populerArtical: forumTopicList

    };
    return ReS(res, 'Forum Dashboard List Got Successfully.', responseJson);
}


// ============================ Forum Subject ============================

// Get All Forum Subject List
module.exports.getForumSubjectList = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;

    [err, forumSubjectList] = await to(forumService.getForumSubjectList(accountId , req.params.id));
    if (err) return ReE(res, err, 422);


    if (forumSubjectList.length == 0) {

        return ReE(res, 'Subjects Not Available', 204);

    } else {

        return ReS(res, 'All Subject List Got Successfully.', forumSubjectList);
    }


}

// ============================ Forum Topic ============================

// Get All Forum Topic List
module.exports.getForumTopicList = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;
    [err, forumTopicList] = await to(forumService.getForumTopicList(accountId , req.params.id));
    if (err) return ReE(res, err, 422);


    if (forumTopicList == null || forumTopicList.length == 0) {

        return ReE(res, 'Forum Topics Not Available', 204);

    } else {

        return ReS(res, 'All Forum Topic List Got Successfully.', forumTopicList);
    }


}


// ============================ Forum Articles ============================


// Get All Forum Articles List
module.exports.getForumArticlesList = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;
    [err, forumTopicList] = await to(forumService.getForumArticlesList(accountId, req.params.id));
    if (err) return ReE(res, err, 422);


    if (forumTopicList.length == 0) {

        return ReE(res, 'Forum Articles Not Available', 204);

    } else {

        var signedArticleList = [];

        await Promise.all(forumTopicList.articals.map(async (artical) => {

            var articalJSON = artical.toJSON();            
            articalJSON.author.image = await GetSignUrl(articalJSON.author.image);
            signedArticleList.push(articalJSON);

        }));

        let forumTopicListJSON = forumTopicList.toJSON();
        forumTopicListJSON.articals = signedArticleList;
        return ReS(res, 'All Forum Articles List Got Successfully.', forumTopicListJSON);
    }
}

// Get One Forum Articles
module.exports.getForumArticle = async function (req, res) {

    const accountId = req.user.toJSON().branch.account.id;

    [err, forumArticle] = await to(forumService.getForumArticles(req.params.id , accountId));
    if (err) return ReE(res, err, 422);


    if (!forumArticle) {

        return ReE(res, 'Forum Article Not Available', 422);

    } else {

        let forumArticleJson = forumArticle.toJSON();
        forumArticleJson.author.image = await GetSignUrl(forumArticleJson.author.image);
        return ReS(res, 'Forum Article Got Successfully.', forumArticleJson);
    }
}
