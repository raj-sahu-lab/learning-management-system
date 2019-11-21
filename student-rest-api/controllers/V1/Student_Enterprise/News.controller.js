const newsService = require('../../../services/V1/Student_Enterprise/News.service');
const { to, ReE, ReS, UploadImage, GetSignUrl, DeleteFromBucket } = require('../../../services/V1/util.service');
const fs = require('fs');


// ---------------------------------------------- News Category ---------------------------------------------- 

// Get All News Category List
module.exports.getNewsCategoryList = async function (req, res) {

    [err, newsCategoryList] = await to(newsService.getNewsCategoryList(req.user.toJSON().branch.account.id));
    if (err) return ReE(res, err, 422);

    if (newsCategoryList.length == 0) {

        return ReE(res, 'News Category List is empty', 204);

    } else {

        var newsCategorySignedList = [];

        await Promise.all(newsCategoryList.map(async (news) => {

            var news = news.toJSON();
            news.image = await GetSignUrl(news.image);
            newsCategorySignedList.push(news)

        }));

        return ReS(res, 'All News Category List Got Successfully.', newsCategorySignedList);
    }
}

// ---------------------------------------------- News Category ---------------------------------------------- 


// ---------------------------------------------- News ---------------------------------------------- 

// Get All News List
module.exports.getNewsList = async function (req, res) {

    const body = req.fields;
    if (!body.categoryId) {

        return ReE(res, 'News category id.', 422);

    } else {

        const accountId = req.user.toJSON().branch.account.id;

        [err, newsList] = await to(newsService.getNewsList(accountId, body.categoryId));
        if (err) return ReE(res, err, 422);

        if (newsList.length == 0) {

            return ReE(res, 'News Not Available', 204);

        } else {

            var newsSignedList = [];

            await Promise.all(newsList.map(async (news) => {

                var news = news.toJSON();
                news.image = await GetSignUrl(news.image);
                newsSignedList.push(news)

            }));

            return ReS(res, 'All News List Got Successfully.', newsSignedList);
        }

    }
}


// ---------------------------------------------- News ---------------------------------------------- 