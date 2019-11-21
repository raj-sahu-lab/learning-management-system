const newsService = require('../../../services/V1/Institute/news.service');
const { to, ReE, ReS, UploadImage, GetSignUrl, DeleteFromBucket } = require('../../../services/V1/util.service');
const fs = require('fs');


// ---------------------------------------------- News Category ---------------------------------------------- 

// Get All News Category List
const getNewsCategoryList = async function (req, res) {

    if(req.params.isSelection != null){

        [err, newsCategoryList] = await to(newsService.getNewsCategoryList(req.user,true));
        if (err) return ReE(res, err, 422);

        if (newsCategoryList.length == 0) {

            return ReE(res, 'News Category Not Available', 204);

        } else {

            return ReS(res, 'All News Category List Got Successfully.', newsCategoryList);
        }

    } else {

        [err, newsCategoryList] = await to(newsService.getNewsCategoryList(req.user));
        if (err) return ReE(res, err, 422);

        if (newsCategoryList.length == 0) {

            return ReE(res, 'News Category Not Available', 204);

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
}
module.exports.getNewsCategoryList = getNewsCategoryList;

// Add New News Category
const addNewsCategory = async function (req, res) {

    const body = req.fields;

    if (req.files.image == null) {

        return ReE(res, 'Please select news image.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else {


        var imageBuffer = fs.readFileSync(req.files.image.path);
        var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

        if (err) return ReE(res, err, 422);

        let newsCategoryInfo = {

            account_id: req.user.account_id,
            title: body.title,
            image: s3Bucket.Key,
            description: body.description,
            create_ip: req.ip
        };

        [err, newsCategory] = await to(newsService.addNewsCategory(newsCategoryInfo));
        if (err) return ReE(res, err, 422);

        if (newsCategory) {

            [err, newsCategory] = await to(newsService.getNewsCategory(req.user.account_id, newsCategory.id));
            var newsCategory = newsCategory.toJSON();
            newsCategory.image = await GetSignUrl(newsCategory.image);
            return ReS(res, 'News Category added successfully.', newsCategory);

        } else {

            return ReE(res, 'Failed to add news category, please try again.', 422);
        }
    }
}
module.exports.addNewsCategory = addNewsCategory;

// Update News Category
const updateNewsCategory = async function (req, res) {

    const body = req.fields;
    if (!body.categoryId) {

        return ReE(res, 'News category id missing.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    }  else if (body.status == null) {

        return ReE(res, 'Please select news category status.', 422);
    }
    else {

        [err, newsCategory] = await to(newsService.getNewsCategory(req.user.account_id, body.categoryId));
        if (err) return ReE(res, err, 422);

        if(newsCategory == null){

            return ReE(res, 'News Category not found.', 422);
        }
        
        var newsCategory = newsCategory.toJSON();
        var imageName = newsCategory.image;

        if (req.files.image != null) {

            if (imageName != '') {

                [err, result] = await to(DeleteFromBucket(imageName));
                if (err) return ReE(res, err, 422);
            }

            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

            if (err) return ReE(res, err, 422);
            imageName = s3Bucket.Key;

        }

        let newsCategoryInfo = {

            account_id: req.user.account_id,
            title: body.title,
            image: imageName,
            description: body.description,
            status: body.status,
            update_ip: req.ip
            
        };

        [err, newsCategory] = await to(newsService.updateNewsCategory(body.categoryId, newsCategoryInfo));
        if (err) return ReE(res, err, 422);

        if (newsCategory.length === 1 && newsCategory[0] == 1) {

            [err, newsCategory] = await to(newsService.getNewsCategory(req.user.account_id, body.categoryId));
            var newsCategory = newsCategory.toJSON();
            newsCategory.image = await GetSignUrl(newsCategory.image);

            return ReS(res, 'News Category updated successfully.', newsCategory);

        } else {

            return ReE(res, 'Failed to update news category, please try again.', 422);
        }
    }
}
module.exports.updateNewsCategory = updateNewsCategory;

// Delete News Category
const deleteNewsCategory = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'News Category id missing.');

    } else {

        [err, newsCategory] = await to(newsService.deleteNewsCategory(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (newsCategory.length === 1 && newsCategory[0] == 1) {

            return ReS(res, 'News Category deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete news category. please try again.');
        }
    }
}
module.exports.deleteNewsCategory = deleteNewsCategory;

// ---------------------------------------------- News Category ---------------------------------------------- 


// ---------------------------------------------- News ---------------------------------------------- 

// Get All News List
const getNewsList = async function (req, res) {

    [err, newsList] = await to(newsService.getNewsList(req.user));
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
module.exports.getNewsList = getNewsList;

// Add New News
const addNews = async function (req, res) {

    const body = req.fields;

    if(!body.categoryId){

        return ReE(res, 'Please select news category.', 422);

    } else if (req.files.image == null) {

        return ReE(res, 'Please select news image.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else if (!body.dateTime){

        return ReE(res, 'Please select news date.', 422);

    } else {


        var imageBuffer = fs.readFileSync(req.files.image.path);
        var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

        if (err) return ReE(res, err, 422);

        let newsInfo = {

            category_id: body.categoryId,
            account_id: req.user.account_id,
            title: body.title,
            image: s3Bucket.Key,
            description: body.description,
            news_datetime: body.dateTime,
            create_ip: req.ip
        };

        [err, news] = await to(newsService.addNews(newsInfo));
        if (err) return ReE(res, err, 422);

        if (news) {

            [err, news] = await to(newsService.getNews(req.user.account_id, news.id));
            var news = news.toJSON();
            news.image = await GetSignUrl(news.image);
            return ReS(res, 'News added successfully.', news);

        } else {

            return ReE(res, 'Failed to add news, please try again.', 422);
        }
    }
}
module.exports.addNews = addNews;

// Update News
const updateNews = async function (req, res) {

    const body = req.fields;
    if (!body.newsId) {

        return ReE(res, 'News id missing.', 422);

    } else if (!body.categoryId) {

        return ReE(res, 'News category id missing.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    }  else if (!body.dateTime){

        return ReE(res, 'Please select news date.', 422);

    }  else if (body.status == null) {

        return ReE(res, 'Please select news status.', 422);

    } else {

        [err, news] = await to(newsService.getNews(req.user.account_id, body.newsId));
        if (err) return ReE(res, err, 422);

        if(news == null){

            return ReE(res, 'News not found.', 422);
        }
        
        var news = news.toJSON();
        var imageName = news.image;

        if (req.files.image != null) {

            if (imageName != '') {

                [err, result] = await to(DeleteFromBucket(imageName));
                if (err) return ReE(res, err, 422);
            }

            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

            if (err) return ReE(res, err, 422);
            imageName = s3Bucket.Key;

        }

        let newsInfo = {

            account_id: req.user.account_id,
            category_id: body.categoryId,
            title: body.title,
            image: imageName,
            description: body.description,
            news_datetime: body.dateTime,
            status: body.status,
            update_ip: req.ip
            
        };

        [err, news] = await to(newsService.updateNews(body.newsId, newsInfo));
        if (err) return ReE(res, err, 422);

        if (news.length === 1 && news[0] == 1) {

            [err, news] = await to(newsService.getNews(req.user.account_id, body.newsId));
            var news = news.toJSON();
            news.image = await GetSignUrl(news.image);

            return ReS(res, 'News updated successfully.', news);

        } else {

            return ReE(res, 'Failed to update news, please try again.', 422);
        }
    }
}
module.exports.updateNews = updateNews;

// Delete News
const deleteNews = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'News id missing.');

    } else {

        [err, news] = await to(newsService.deleteNews(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (news.length === 1 && news[0] == 1) {

            return ReS(res, 'News deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete news. please try again.');
        }
    }
}
module.exports.deleteNews = deleteNews;

// ---------------------------------------------- News ---------------------------------------------- 