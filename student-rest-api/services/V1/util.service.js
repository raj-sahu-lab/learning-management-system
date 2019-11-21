require('dotenv').config();

const CONFIG = require('../../config/config');
const { to } = require('await-to-js');
const pe = require('parse-error');
const dateFormat = require('dateformat');
const aws = require('aws-sdk');
const cfsign = require('aws-cloudfront-sign');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");
var handlebars = require('handlebars');

const Crypto = require("crypto");

aws.config.update({region: CONFIG.bucket});
const s3 = new aws.S3({
    accessKeyId: CONFIG.accessKeyId,
    secretAccessKey: CONFIG.secretAccessKey,
    Bucket: CONFIG.bucket
});

module.exports.to = async (promise) => {

    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];
    return [null, res];
};

module.exports.toWithout = async (promise) => {

    let err, res;
    [err, res] = await to(promise);

    if (err) return [err];
    return [null, res];
};

module.exports.ReE = function (res, err, code, data) { // Error Response

    res.setHeader('Cache-Control', 'no-store');
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;
    var responseJSON = { success: false, error: err };

    if (data) { responseJSON.data = data; }

    if (res.req.baseUrl.includes('/v1/studentEnterprise')) {

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(responseJSON), CONFIG.WEBSITE_ENCRYPTION_KEY).toString();
        const encryptedJSON = { data: ciphertext };
        if (typeof code !== 'undefined') res.statusCode = code;
        return res.json(encryptedJSON);

    } else {

        return res.json(responseJSON);
    }
};

module.exports.ReS = function (res, message, data, code) { // Success Response

    res.setHeader('Cache-Control', 'no-store');
    if (res.req.baseUrl && (res.req.baseUrl.includes('/v1/website'))) {

        const responseJSON = { success: true, message: message, data: data };

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(responseJSON), CONFIG.WEBSITE_ENCRYPTION_KEY).toString();
        const encryptedJSON = { /*token: data.account.bearer_token, */ data: ciphertext };
        if (typeof code !== 'undefined') res.statusCode = code;
        return res.json(encryptedJSON);

    } else if (res.req.baseUrl && (res.req.baseUrl.includes('/v1/studentEnterprise'))) {

        const responseJSON = { success: true, message: message, data: data };

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(responseJSON), CONFIG.WEBSITE_ENCRYPTION_KEY).toString();
        const encryptedJSON = { /*token: data.account.bearer_token, */ data: ciphertext };
        if (typeof code !== 'undefined') res.statusCode = code;
        return res.json(encryptedJSON);

    }
     else if (res.req.baseUrl && (res.req.baseUrl.includes('/v1/institute'))) {

        if(CONFIG.port == 3000){
            const responseJSON = { success: true, message: message, data: data };

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(responseJSON), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
            const encryptedJSON = { data: ciphertext };
            if (typeof code !== 'undefined') res.statusCode = code;
            return res.json(encryptedJSON);

        } else {

            const responseJSON = { success: true, message: message, data: data };
            if (typeof code !== 'undefined') res.statusCode = code;
            return res.json(responseJSON);
        }
       

    } else {

        const responseJSON = { success: true, message: message, data: data };
        if (typeof code !== 'undefined') res.statusCode = code;
        return res.json(responseJSON);
    }
};

module.exports.ReS1 = function (res, message, data, code) { // Success Response}

    const responseJSON = { success: true, message: message, data: data };
    return res.json(responseJSON);
}

module.exports.TE = TE = function (err_message, log) { // TE stands for Throw Error

    throw new Error(err_message);
};

global.currentDateFormat = function (formate) {

    return dateFormat(new Date(), formate);
};

/* 
    Upload Images and more File in the File Name Folder
*/
module.exports.UploadImage = async function (accountId, imageName, imageBuffer) {

    var imageName = imageName.replace(/\s+/g, "_");
    const fileKey = accountId + '/files/' + imageName;

    const params = {
        Bucket: CONFIG.bucket,
        Key: fileKey,
        Body: imageBuffer,
        CacheControl: "max-age=31556926 , public"
    };
    [err, res] = await to(s3.upload(params).promise());
    if (err) this.TE(err.message);

    return res;
};

/* 
    Upload Images and more File in the File Name Folder
*/
module.exports.UploadStudentImage = async function (imageName, imageBuffer) {

    var imageName = imageName.replace(/\s+/g, "_");
    const fileKey = 'Student_Images/' + imageName;

    const params = {
        Bucket: CONFIG.bucket,
        Key: fileKey,
        Body: imageBuffer,
        CacheControl: "max-age=31556926 , public"
    };
    [err, res] = await to(s3.upload(params).promise());
    if (err) this.TE(err.message);

    return res;
};

/* 
    Upload PDF File in the PDF Name Folder, 
*/
module.exports.UploadPdf = async function (accountId, pdfName, pdfBuffer) {

    var pdfName = pdfName.replace(/\s+/g, "_");
    const fileKey = accountId + '/pdf/' + pdfName;

    const params = {
        Bucket: CONFIG.bucket,
        Key: fileKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        CacheControl: "max-age=31556926 , public"
    };
    [err, res] = await to(s3.upload(params).promise());
    if (err) this.TE(err.message);

    return res;
};

/* 
    Delete file From S3 Bucket
*/
module.exports.DeleteFromBucket = async function (fileKey) {
    const params = { Bucket: CONFIG.bucket, Key: fileKey };
    [err, result] = await to(s3.deleteObject(params).promise());
    if (err) this.TE(err.message);

    return result;
};

/*
    The Comman Function is used to manipulate the sign url of s3 bucket object with cloudFront to provide security of an
    Obejct, The Time Duration of the sign url is 60 minutes.
*/

module.exports.GetSignUrl = async function (fileUrl) {


    var timeInMss = Date.now() + (600 * 60000);
    const signingParams = {
        keypairId: CONFIG.cloud_front_public_key,
        privateKeyPath: CONFIG.STATCI_FILES + 'pk-APKAXXXXXXXXEXAMPLE5.pem', // Local Path
        expireTime: timeInMss
    };

    const signedUrl = await cfsign.getSignedUrl(CONFIG.cloud_front_url + fileUrl, signingParams);

    return signedUrl;

    // return "https://edtech-platformdevelopment.s3.ap-south-1.amazonaws.com/"+fileUrl;
};


module.exports.RegisterInstituteInSIB = async function (email, name) {

    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"


    var apiInstance = new SibApiV3Sdk.SendersApi();

    let sender = new SibApiV3Sdk.CreateSender();
    sender.email = email;
    sender.name = name;
    var opts = {
        'sender': sender
    };

    const result = await to(apiInstance.createSender(opts));

    if (result.length == 2) {
        if (result[0]) {
            this.TE(result[0].response.text);
        }

        return result[1];
    }
}

module.exports.GetFolderInSIB = async function () {

    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"


    var apiInstance = new SibApiV3Sdk.ContactsApi();

    const result = await to(apiInstance.getFolders(16, 0));

    if (result.length == 2) {
        if (result[0]) {
            this.TE(result[0].response.text);
        }

        return result[1];
    }
}

module.exports.InstituteFolderInSIB = async function (name) {

    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"


    var apiInstance = new SibApiV3Sdk.FoldersApi();

    var createFolder = new SibApiV3Sdk.CreateUpdateFolder();
    createFolder.name = name;

    const result = await to(apiInstance.createFolder(createFolder));

    if (result.length == 2) {
        if (result[0]) {
            this.TE(result[0].response.text);
        }

        return result[1];
    }
}

module.exports.RegisterForMailing = async function (email, firstName, lastName) {

    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"

    var apiInstance = new SibApiV3Sdk.ContactsApi();
    var createContact = new SibApiV3Sdk.CreateContact();
    createContact.attributes = { FIRSTNAME: firstName, LASTNAME: lastName };
    createContact.email = email;

    const result = await to(apiInstance.createContact(createContact));

    if (result.length == 2) {
        if (result[0]) {
            return null; //this.TE(result[0].response.text);
        }

        return result[1];
    }
}


module.exports.SendEmailCampaign = async function (folderId, campaignDetail) {


    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"

    // Create List Id using email list
    var apiInstance = new SibApiV3Sdk.ContactsApi();
    var createList = new SibApiV3Sdk.CreateList();

    createList.name = campaignDetail.title;
    createList.folderId = parseInt(folderId);

    const result = await to(apiInstance.createList(createList));

    if (result.length == 2) {

        if (result[0]) {

            return this.TE(JSON.parse(result[0].response.text).message);
        }

        const listId = result[1].id;

        var apiInstance = new SibApiV3Sdk.ListsApi();
        var contactEmails = new SibApiV3Sdk.AddContactToList();
        contactEmails.emails = campaignDetail.listIds;

        const contactEmailsResult = await to(apiInstance.addContactToList(listId, contactEmails));

        if (contactEmailsResult.length == 2) {

            if (contactEmailsResult[0]) {
                // return this.TE(JSON.parse(contactEmailsResult[0].response.text));
                return this.TE(contactEmailsResult[0].response.text);
            }


            var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

            var emailCampaignsRecipients = new SibApiV3Sdk.CreateEmailCampaignRecipients();
            emailCampaignsRecipients.listIds = [listId];

            var emailCampaignsSender = new SibApiV3Sdk.CreateEmailCampaignSender();

            emailCampaignsSender.name = campaignDetail.title;
            emailCampaignsSender.email = campaignDetail.email;

            var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

            emailCampaigns = {
                sender: emailCampaignsSender,
                name: campaignDetail.title,
                subject: campaignDetail.subject,
                replyTo: campaignDetail.email,
                recipients: emailCampaignsRecipients,
                attachmentUrl: campaignDetail.attachmentUrl,
                inlineImageActivation: false,
                htmlContent: campaignDetail.content,
            }

            const resultOfCampaign = await to(apiInstance.createEmailCampaign(emailCampaigns));

            if (err) this.TE(err);

            if (resultOfCampaign.length == 2) {

                if (resultOfCampaign[0]) {

                    return this.TE(resultOfCampaign[0].response.text);
                }

                const campaignId = resultOfCampaign[1].id;
                var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

                const resultOfSendCampaign = await to(apiInstance.sendEmailCampaignNow(campaignId));

                let emailTo = new SibApiV3Sdk.SendTestEmail();

                emailTo = {
                    "emailTo": contactEmails.emails
                };

                const resultOfSendEmail = await to(apiInstance.sendTestEmail(campaignId, emailTo));

                if (err) this.TE(err);

                if (resultOfSendCampaign.length == 2) {

                    if (resultOfSendCampaign[0]) {

                        return this.TE(resultOfSendCampaign[0].response.text);
                    }

                    return campaignId;
                }

            }

        }
    }
}



module.exports.GetCampaignReport = async function (campaignId) {


    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "YOUR_SENDINBLUE_API_KEY"

    var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();


    const resultOfCampaign = await to(apiInstance.getEmailCampaign(campaignId));
    if (resultOfCampaign.length == 2) {

        if (resultOfCampaign[0]) {

            return this.TE(resultOfCampaign[0].response.text);
        }

        return resultOfCampaign[1];
    }
}

// When student register at that time mail
module.exports.SendStudentRegisterEMail = async function (emailId, studentName, phone, password) {

    let transporter = nodemailer.createTransport({
        pool: true,
        host: CONFIG.SMTP_Host,
        port: CONFIG.SMTP_Port,
        secure: true,
        auth: {
            user: CONFIG.SMTP_UserEmail,
            pass: CONFIG.SMTP_UserPassword
        }
    });

    const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <title></title>
        <style type="text/css">
            /* Resets */
            
            .ReadMsgBody {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
            
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            
            body {
                -webkit-text-size-adjust: none;
                -ms-text-size-adjust: none;
            }
            
            body {
                margin: 0;
                padding: 0;
            }
            
            .yshortcuts a {
                border-bottom: none !important;
            }
            
            .rnb-del-min-width {
                min-width: 0 !important;
            }
            /* Add new outlook css start */
            
            .templateContainer {
                max-width: 590px !important;
                width: auto !important;
            }
            /* Add new outlook css end */
            /* Image width by default for 3 columns */
            
            img[class="rnb-col-3-img"] {
                max-width: 170px;
            }
            /* Image width by default for 2 columns */
            
            img[class="rnb-col-2-img"] {
                max-width: 264px;
            }
            /* Image width by default for 2 columns aside small size */
            
            img[class="rnb-col-2-img-side-xs"] {
                max-width: 180px;
            }
            /* Image width by default for 2 columns aside big size */
            
            img[class="rnb-col-2-img-side-xl"] {
                max-width: 350px;
            }
            /* Image width by default for 1 column */
            
            img[class="rnb-col-1-img"] {
                max-width: 550px;
            }
            /* Image width by default for header */
            
            img[class="rnb-header-img"] {
                max-width: 590px;
            }
            /* Ckeditor line-height spacing */
            
            .rnb-force-col p,
            ul,
            ol {
                margin: 0px!important;
            }
            
            .rnb-del-min-width p,
            ul,
            ol {
                margin: 0px!important;
            }
            /* tmpl-2 preview */
            
            .rnb-tmpl-width {
                width: 100%!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-width {
                padding-right: 15px!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-align {
                float: right!important;
            }
            /* Ul Li outlook extra spacing fix */
            
            li {
                mso-margin-top-alt: 0;
                mso-margin-bottom-alt: 0;
            }
            /* Outlook fix */
            
            table {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            /* Outlook fix */
            
            table,
            tr,
            td {
                border-collapse: collapse;
            }
            /* Outlook fix */
            
            p,
            a,
            li,
            blockquote {
                mso-line-height-rule: exactly;
            }
            /* Outlook fix */
            
            .msib-right-img {
                mso-padding-alt: 0 !important;
            }
            /* Fix text line height on preview */
            
            .content-spacing div {
                display: list-item;
                list-style-type: none;
            }
            
            @media only screen and (min-width:590px) {
                /* mac fix width */
                .templateContainer {
                    width: 590px !important;
                }
            }
            
            @media screen and (max-width: 360px) {
                /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
                .rnb-yahoo-width {
                    width: 360px !important;
                }
            }
            
            @media screen and (max-width: 380px) {
                /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
                .element-img-text {
                    font-size: 24px !important;
                }
                .element-img-text2 {
                    width: 230px !important;
                }
                .content-img-text-tmpl-6 {
                    font-size: 24px !important;
                }
                .content-img-text2-tmpl-6 {
                    width: 220px !important;
                }
            }
            
            @media screen and (max-width: 480px) {
                td[class="rnb-container-padding"] {
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                }
                /* force container nav to (horizontal) blocks */
                td.rnb-force-nav {
                    display: inherit;
                }
                /* fix text alignment "tmpl-11" in mobile preview */
                .rnb-social-text-left {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .rnb-social-text-right {
                    width: 100%;
                    text-align: center;
                }
            }
            
            @media only screen and (max-width: 600px) {
                /* center the address &amp; social icons */
                .rnb-text-center {
                    text-align: center !important;
                }
                /* force container columns to (horizontal) blocks */
                th.rnb-force-col {
                    display: block;
                    padding-right: 0 !important;
                    padding-left: 0 !important;
                    width: 100%;
                }
                table.rnb-container {
                    width: 100% !important;
                }
                table.rnb-btn-col-content {
                    width: 100% !important;
                }
                table.rnb-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-last-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-col-2-noborder-onright {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                }
                table.rnb-col-2-noborder-onleft {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-top: 10px;
                    padding-top: 10px;
                }
                table.rnb-last-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-1 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                img.rnb-col-3-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xs {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xl {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-1-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-header-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                    margin: 0 auto;
                }
                img.rnb-logo-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                td.rnb-mbl-float-none {
                    float: inherit !important;
                }
                .img-block-center {
                    text-align: center !important;
                }
                .logo-img-center {
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-align {
                    margin: 0 auto !important;
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-center {
                    display: inline-block;
                }
                /* tmpl-11 preview */
                .social-text-spacing {
                    margin-bottom: 0px !important;
                    padding-bottom: 0px !important;
                }
                /* tmpl-11 preview */
                .social-text-spacing2 {
                    padding-top: 15px !important;
                }
            }
        </style>
        <!--[if gte mso 11]><style type="text/css">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]-->
        <!--[if !mso]><!-->
        <style type="text/css">
            table {
                border-spacing: 0;
            }
            
            table td {
                border-collapse: collapse;
            }
        </style>
        <!--<![endif]-->
        <!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head>
    
    <body>
    
        <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template" bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">
    
            <tbody>
                <tr style="display:none !important; font-size:1px; mso-hide: all;">
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <!--[if gte mso 9]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="590" style="width:590px;">
                            <tr>
                            <td align="center" valign="top" width="590" style="width:590px;">
                            <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer" style="max-width:590px!important; width: 590px;">
                            <tbody>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="38">
                                                                        <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
                                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td valign="top" align="center">
                                                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="logo-img-center">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="middle" align="center" style="line-height: 1px;">
                                                                                                            <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; " cellspacing="0" cellpadding="0" border="0">
                                                                                                                <div>
                                                                                                                    <a style="text-decoration:none;" target="_blank" href="https://example.com/"><img width="209" vspace="0" hspace="0" border="0" alt="Company Inc." style="float: left;max-width:209px;" class="rnb-logo-img" src="{{logo}}"></a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
    
                                            <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" width="100%" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="rnb-container-padding" style="font-size: px;font-family: ; color: ;">
    
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container" align="center" style="margin:auto;">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col" align="center">
    
                                                                                            <table border="0" cellspacing="0" cellpadding="0" align="center" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
    
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:center;">
    
                                                                                                            <span style="color:#3c4858;"><span style="color:#008000;"><strong><span style="font-size:24px;">We're so happy you're here. </span></strong>
                                                                                                            </span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
    
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
    
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_5">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);">
    
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal; padding-right: 0px;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="100%" align="left" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858; line-height: 21px;">
                                                                                                            <div style="text-align: justify;"><span style="font-size:16px;">We are super excited to start a fantastic journey of learning new things together. We promise you to give a classroom experience with individual attention. We aspire to create a community where there are two-way communications in education.</span></div>
    
                                                                                                            <div style="text-align: justify;">
                                                                                                                <br>
                                                                                                                <span style="font-size:16px;">Your inbox is going to be far more inspiring from now! We are going to share fun stuff, invite you to free live sessions and exclusive coupons.</span></div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
    
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                              <tbody>
                                                  <tr>
                                                      <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" class="mso-button-block rnb-container" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                              <tbody>
                                                                  <tr>
                                                                      <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td valign="top" class="rnb-container-padding" align="left">
  
                                                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <th class="rnb-force-col" valign="top">
  
                                                                                          <table border="0" valign="top" cellspacing="0" cellpadding="0" width="550" align="center" class="rnb-col-1">
  
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="top">
                                                                                                          <table cellpadding="0" border="0" align="center" cellspacing="0" class="rnb-btn-col-content" style="margin:auto; border-collapse: separate;">
                                                                                                              <tbody>
																													<tr style="font-size: 14px;font-family: Arial,Helvetica,sans-serif,sans-serif;color: #3c4858;line-height: 21px;">
																														<td width="auto" valign="middle">User name - {{phone}}</td>
																													</tr>
																													<tr style="font-size: 14px;font-family: Arial,Helvetica,sans-serif,sans-serif;color: #3c4858;line-height: 21px;">
																														<td width="auto" valign="middle">Password - {{password}}</td>
																													</tr>
                                                                                                                  <tr>
                                                                                                                      <td width="auto" valign="middle" bgcolor="#f56b58" align="center" height="40" style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                          <span style="color:#ffffff; font-weight:normal;">
																															  <a href="https://student.example.com/" style="text-decoration:none; color:#ffffff; font-weight:normal;" target="_blank">Login</a>
																														  </span>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </th>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
  
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="30" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="30">
                                                                        <img width="20" height="30" style="display:block; max-height:30px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso 15]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col img-block-center" style="text-align: left; font-weight: normal; padding-right: 20px;" valign="top" width="180">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" align="left" class="rnb-col-2-noborder-onright" width="180">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="100%" style="line-height: 1px;" class="img-block-center" valign="top" align="left">
                                                                                                            <div style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;">
                                                                                                                <div><img alt="" border="0" hspace="0" vspace="0" width="180" style="vertical-align:top; float: left; width:180px;max-width:180px !important; " class="rnb-col-2-img-side-xl" src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg"></div>
                                                                                                                <div style="clear:both;"></div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="350" align="left" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                                                                            <span style="color:#3c4858; "><span style="font-size: 18px;"><b>Feel free to reach out to us&nbsp;</b></span></span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td class="rnb-mbl-float-none" style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;">
                                                                                                            <div>Keep exploring around and let us know if you need any help. We can be approached via following ways.</div>
    
                                                                                                            <div><span style="background-color: transparent;">Email us - support@example.com, </span></div>
    
                                                                                                            <div><span style="background-color: transparent;">Call us - +14157078933.</span></div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
    
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso 15]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="mso-button-block rnb-container" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="550" align="center" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="rnb-btn-col-content" style="margin:auto; border-collapse: separate;">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td width="auto" valign="middle" bgcolor="#f56b58" align="center" height="40" style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                            <span style="color:#ffffff; font-weight:normal;">
																																<a style="text-decoration:none; color:#ffffff; font-weight:normal;" target="_blank">Happy Learning !!!</a>
																															</span>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width: 590px; background-color: rgb(249, 250, 252);">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="264" align="left" class="rnb-col-2 rnb-social-text-left" style="border-bottom:0;">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" align="left" cellspacing="0" class="rnb-btn-col-content">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" align="left" style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px" class="rnb-text-center">
                                                                                                                        <div>
                                                                                                                            <div>platform.example.com&nbsp;</div>
                                                                                                                            <div>340 S Lemon Ave,</div>
                                                                                                                            <div>#9894 Walnut,</div>
                                                                                                                            <div>Ca 91789</div>
                                                                                                                        </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th ng-if="item.text.align=='left'" class="rnb-force-col rnb-social-width" valign="top" style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="246" align="right" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" cellspacing="0" class="rnb-social-align" style="float: right;" align="right">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" class="rnb-text-center" ng-init="width=setSocialIconsBlockWidth(item)" width="125" align="right">
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.facebook.com/Utobians"><img alt="Facebook" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="Twitter" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="LinkedIn" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3" id="Layout_3">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width:590px; background-color: #f9fafc; text-align: center;">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                <div>This email was sent to {{ emailId }}
                                                                                    <div>You received this email because have signed up on www.example.com&nbsp;</div>
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: block; text-align: center;">
                                                                                <span style="font-size:14px; font-weight:normal; display: inline-block; text-align:center; font-family:Arial,Helvetica,sans-serif;">
																					<a style="text-decoration:underline; color:#666666;font-size:14px;font-weight:normal;font-family:Arial,Helvetica,sans-serif;" target="_blank" href="{{ unsubscribe }}">Unsubscribe here</a>
																				</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_4" id="Layout_4">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                            <div>©2021 Company Inc.</div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3971" id="Layout_3971">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="38">
                                                                        <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--[if gte mso 9]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    
    </body>
    
    </html>`;

    var template = handlebars.compile(htmlContent);
    var replacements = {
        phone: phone,
        password: password,
        emailId: emailId,
        logo: 'https://img.mailinblue.com/2598720/images/rnb/original/5e47eadb9967ccbc76710418.png'
    };
    var htmlToSend = template(replacements);

    let emailInfo = {
        from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
        to: '"' + studentName + '" ' + emailId,
        subject: 'We\'re so happy to be your learning partner',
        html: htmlToSend
    }
    let info = await to(transporter.sendMail(emailInfo));
    if (err) this.TE(err.message);
    return info;
}

// When student register at that time mail
module.exports.SendStudentEMailInstituteAdd = async function (emailData) {

    let transporter = nodemailer.createTransport({
        pool: true,
        host: CONFIG.SMTP_Host,
        port: CONFIG.SMTP_Port,
        secure: true,
        auth: {
            user: CONFIG.SMTP_UserEmail,
            pass: CONFIG.SMTP_UserPassword
        }
    });

    const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <title></title>
        <style type="text/css">
            /* Resets */
            
            .ReadMsgBody {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
            
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            
            body {
                -webkit-text-size-adjust: none;
                -ms-text-size-adjust: none;
            }
            
            body {
                margin: 0;
                padding: 0;
            }
            
            .yshortcuts a {
                border-bottom: none !important;
            }
            
            .rnb-del-min-width {
                min-width: 0 !important;
            }
            /* Add new outlook css start */
            
            .templateContainer {
                max-width: 590px !important;
                width: auto !important;
            }
            /* Add new outlook css end */
            /* Image width by default for 3 columns */
            
            img[class="rnb-col-3-img"] {
                max-width: 170px;
            }
            /* Image width by default for 2 columns */
            
            img[class="rnb-col-2-img"] {
                max-width: 264px;
            }
            /* Image width by default for 2 columns aside small size */
            
            img[class="rnb-col-2-img-side-xs"] {
                max-width: 180px;
            }
            /* Image width by default for 2 columns aside big size */
            
            img[class="rnb-col-2-img-side-xl"] {
                max-width: 350px;
            }
            /* Image width by default for 1 column */
            
            img[class="rnb-col-1-img"] {
                max-width: 550px;
            }
            /* Image width by default for header */
            
            img[class="rnb-header-img"] {
                max-width: 590px;
            }
            /* Ckeditor line-height spacing */
            
            .rnb-force-col p,
            ul,
            ol {
                margin: 0px!important;
            }
            
            .rnb-del-min-width p,
            ul,
            ol {
                margin: 0px!important;
            }
            /* tmpl-2 preview */
            
            .rnb-tmpl-width {
                width: 100%!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-width {
                padding-right: 15px!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-align {
                float: right!important;
            }
            /* Ul Li outlook extra spacing fix */
            
            li {
                mso-margin-top-alt: 0;
                mso-margin-bottom-alt: 0;
            }
            /* Outlook fix */
            
            table {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            /* Outlook fix */
            
            table,
            tr,
            td {
                border-collapse: collapse;
            }
            /* Outlook fix */
            
            p,
            a,
            li,
            blockquote {
                mso-line-height-rule: exactly;
            }
            /* Outlook fix */
            
            .msib-right-img {
                mso-padding-alt: 0 !important;
            }
            /* Fix text line height on preview */
            
            .content-spacing div {
                display: list-item;
                list-style-type: none;
            }
            
            @media only screen and (min-width:590px) {
                /* mac fix width */
                .templateContainer {
                    width: 590px !important;
                }
            }
            
            @media screen and (max-width: 360px) {
                /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
                .rnb-yahoo-width {
                    width: 360px !important;
                }
            }
            
            @media screen and (max-width: 380px) {
                /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
                .element-img-text {
                    font-size: 24px !important;
                }
                .element-img-text2 {
                    width: 230px !important;
                }
                .content-img-text-tmpl-6 {
                    font-size: 24px !important;
                }
                .content-img-text2-tmpl-6 {
                    width: 220px !important;
                }
            }
            
            @media screen and (max-width: 480px) {
                td[class="rnb-container-padding"] {
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                }
                /* force container nav to (horizontal) blocks */
                td.rnb-force-nav {
                    display: inherit;
                }
                /* fix text alignment "tmpl-11" in mobile preview */
                .rnb-social-text-left {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .rnb-social-text-right {
                    width: 100%;
                    text-align: center;
                }
            }
            
            @media only screen and (max-width: 600px) {
                /* center the address &amp; social icons */
                .rnb-text-center {
                    text-align: center !important;
                }
                /* force container columns to (horizontal) blocks */
                th.rnb-force-col {
                    display: block;
                    padding-right: 0 !important;
                    padding-left: 0 !important;
                    width: 100%;
                }
                table.rnb-container {
                    width: 100% !important;
                }
                table.rnb-btn-col-content {
                    width: 100% !important;
                }
                table.rnb-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-last-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-col-2-noborder-onright {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                }
                table.rnb-col-2-noborder-onleft {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-top: 10px;
                    padding-top: 10px;
                }
                table.rnb-last-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-1 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                img.rnb-col-3-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xs {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xl {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-1-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-header-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                    margin: 0 auto;
                }
                img.rnb-logo-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                td.rnb-mbl-float-none {
                    float: inherit !important;
                }
                .img-block-center {
                    text-align: center !important;
                }
                .logo-img-center {
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-align {
                    margin: 0 auto !important;
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-center {
                    display: inline-block;
                }
                /* tmpl-11 preview */
                .social-text-spacing {
                    margin-bottom: 0px !important;
                    padding-bottom: 0px !important;
                }
                /* tmpl-11 preview */
                .social-text-spacing2 {
                    padding-top: 15px !important;
                }
            }
        </style>
        <!--[if gte mso 11]><style type="text/css">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]-->
        <!--[if !mso]><!-->
        <style type="text/css">
            table {
                border-spacing: 0;
            }
            
            table td {
                border-collapse: collapse;
            }
        </style>
        <!--<![endif]-->
        <!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head>
    
    <body>
    
        <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template" bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">
    
            <tbody>
                <tr style="display:none !important; font-size:1px; mso-hide: all;">
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <!--[if gte mso 9]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="590" style="width:590px;">
                            <tr>
                            <td align="center" valign="top" width="590" style="width:590px;">
                            <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer" style="max-width:590px!important; width: 590px;">
                            <tbody>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="38">
                                                                        <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
                                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td valign="top" align="center">
                                                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="logo-img-center">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="middle" align="center" style="line-height: 1px;">
                                                                                                            <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; " cellspacing="0" cellpadding="0" border="0">
                                                                                                                <div>
                                                                                                                    <a style="text-decoration:none;" target="_blank" href="https://example.com/"><img width="209" vspace="0" hspace="0" border="0" alt="Company Inc." style="float: left;max-width:209px;" class="rnb-logo-img" src="{{logo}}"></a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
    
                                            <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" width="100%" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="rnb-container-padding" style="font-size: px;font-family: ; color: ;">
    
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container" align="center" style="margin:auto;">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col" align="center">
    
                                                                                            <table border="0" cellspacing="0" cellpadding="0" align="center" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
    
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:center;">
    
                                                                                                            <span style="color:#3c4858;"><span style="color:#008000;"><strong><span style="font-size:24px;">We're so happy you're here. </span></strong>
                                                                                                            </span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
    
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
    
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_5">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);">
    
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal; padding-right: 0px;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="100%" align="left" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858; line-height: 21px;">
                                                                                                            <div style="text-align: justify;"><span style="font-size:16px;">We are super excited to start a fantastic journey of learning new things together. We promise you to give a classroom experience with individual attention. We aspire to create a community where there are two-way communications in education.</span></div>
    
                                                                                                            <div style="text-align: justify;">
                                                                                                                <br>
                                                                                                                <span style="font-size:16px;">Your inbox is going to be far more inspiring from now! We are going to share fun stuff, invite you to free live sessions and exclusive coupons.</span>
                                                                                                            </div>

                                                                                                            <div style="text-align: justify;">
                                                                                                                <br>
                                                                                                                <div><span style="font-size:16px;">Institute name - {{instituteName}}</span></div>
                                                                                                                <div><span style="font-size:16px;">Institute code - {{code}}</span></div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
    
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                              <tbody>
                                                  <tr>
                                                      <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" class="mso-button-block rnb-container" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                              <tbody>
                                                                  <tr>
                                                                      <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td valign="top" class="rnb-container-padding" align="left">
  
                                                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <th class="rnb-force-col" valign="top">
  
                                                                                          <table border="0" valign="top" cellspacing="0" cellpadding="0" width="550" align="center" class="rnb-col-1">
  
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="top">
                                                                                                          <table cellpadding="0" border="0" align="center" cellspacing="0" class="rnb-btn-col-content" style="margin:auto; border-collapse: separate;">
                                                                                                              <tbody>
																													<tr style="font-size: 14px;font-family: Arial,Helvetica,sans-serif,sans-serif;color: #3c4858;line-height: 21px;">
																														<td width="auto" valign="middle">User name - {{phone}}</td>
																													</tr>
																													<tr style="font-size: 14px;font-family: Arial,Helvetica,sans-serif,sans-serif;color: #3c4858;line-height: 21px;">
																														<td width="auto" valign="middle">Password - {{password}}</td>
																													</tr>
                                                                                                                    <tr>
                                                                                                                      <td width="auto" valign="middle" bgcolor="#f56b58" align="center" height="40" style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                          <span style="color:#ffffff; font-weight:normal;">
																															  <a href="{{url}}" style="text-decoration:none; color:#ffffff; font-weight:normal;" target="_blank">Confirm Your Email</a>
																														  </span>
                                                                                                                      </td>
                                                                                                                    </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </th>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
  
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="30" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="30">
                                                                        <img width="20" height="30" style="display:block; max-height:30px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso 15]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col img-block-center" style="text-align: left; font-weight: normal; padding-right: 20px;" valign="top" width="180">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" align="left" class="rnb-col-2-noborder-onright" width="180">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="100%" style="line-height: 1px;" class="img-block-center" valign="top" align="left">
                                                                                                            <div style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;">
                                                                                                                <div><img alt="" border="0" hspace="0" vspace="0" width="180" style="vertical-align:top; float: left; width:180px;max-width:180px !important; " class="rnb-col-2-img-side-xl" src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg"></div>
                                                                                                                <div style="clear:both;"></div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="350" align="left" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                                                                            <span style="color:#3c4858; "><span style="font-size: 18px;"><b>Feel free to reach out to us&nbsp;</b></span></span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td class="rnb-mbl-float-none" style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;">
                                                                                                            <div>Keep exploring around and let us know if you need any help. We can be approached via following ways.</div>
    
                                                                                                            <div><span style="background-color: transparent;">Email us - support@example.com, </span></div>
    
                                                                                                            <div><span style="background-color: transparent;">Call us - +14157078933.</span></div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
    
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso 15]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="mso-button-block rnb-container" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="550" align="center" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="rnb-btn-col-content" style="margin:auto; border-collapse: separate;">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td width="auto" valign="middle" bgcolor="#f56b58" align="center" height="40" style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                            <span style="color:#ffffff; font-weight:normal;">
																																<a style="text-decoration:none; color:#ffffff; font-weight:normal;" target="_blank">Happy Learning !!!</a>
																															</span>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width: 590px; background-color: rgb(249, 250, 252);">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="264" align="left" class="rnb-col-2 rnb-social-text-left" style="border-bottom:0;">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" align="left" cellspacing="0" class="rnb-btn-col-content">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" align="left" style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px" class="rnb-text-center">
                                                                                                                        <div>
                                                                                                                            <div>platform.example.com&nbsp;</div>
                                                                                                                            <div>340 S Lemon Ave,</div>
                                                                                                                            <div>#9894 Walnut,</div>
                                                                                                                            <div>Ca 91789</div>
                                                                                                                        </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th ng-if="item.text.align=='left'" class="rnb-force-col rnb-social-width" valign="top" style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="246" align="right" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" cellspacing="0" class="rnb-social-align" style="float: right;" align="right">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" class="rnb-text-center" ng-init="width=setSocialIconsBlockWidth(item)" width="125" align="right">
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.facebook.com/Utobians"><img alt="Facebook" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="Twitter" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
																																					<a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="LinkedIn" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a>
																																				</span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3" id="Layout_3">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width:590px; background-color: #f9fafc; text-align: center;">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                <div>This email was sent to {{ emailId }}
                                                                                    <div>You received this email because have signed up on www.example.com&nbsp;</div>
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: block; text-align: center;">
                                                                                <span style="font-size:14px; font-weight:normal; display: inline-block; text-align:center; font-family:Arial,Helvetica,sans-serif;">
																					<a style="text-decoration:underline; color:#666666;font-size:14px;font-weight:normal;font-family:Arial,Helvetica,sans-serif;" target="_blank" href="{{ unsubscribe }}">Unsubscribe here</a>
																				</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_4" id="Layout_4">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                            <div>©2021 Company Inc.</div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3971" id="Layout_3971">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="38">
                                                                        <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--[if gte mso 9]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    
    </body>
    
    </html>`;

    var template = handlebars.compile(htmlContent);
    var replacements = {
        phone: emailData.phone,
        password: emailData.password,
        emailId: emailData.email,
        url: emailData.url,
        logo: emailData.logo,
        instituteName: emailData.instituteName,
        code: emailData.code
    };

    var htmlToSend = template(replacements);

    let emailInfo = {
        from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
        to: '"' + emailData.userName + '" ' + emailData.email,
        subject: 'We\'re so happy to be your learning partner',
        html: htmlToSend
    }
    let info = await to(transporter.sendMail(emailInfo));
    if (err) this.TE(err.message);
    return info;
}

// When student register at that time mail
module.exports.SendOtpEmail = async function (emailId, otp) {
    
    let transporter = nodemailer.createTransport({
        pool: true,
        service: "gmail",
        host: CONFIG.SMTP_Host,
        port: CONFIG.SMTP_Port,
        secure: true,
        auth: {
            user: CONFIG.SMTP_UserEmail,
            pass: CONFIG.SMTP_UserPassword
        }
    });

    const htmlContent = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />
    <title></title>
    <style type="text/css">
        /* Resets */

        .ReadMsgBody {
            width: 100%;
            background-color: #ebebeb;
        }

        .ExternalClass {
            width: 100%;
            background-color: #ebebeb;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        body {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        body {
            margin: 0;
            padding: 0;
        }

        .yshortcuts a {
            border-bottom: none !important;
        }

        .rnb-del-min-width {
            min-width: 0 !important;
        }

        /* Add new outlook css start */

        .templateContainer {
            max-width: 590px !important;
            width: auto !important;
        }

        /* Add new outlook css end */
        /* Image width by default for 3 columns */

        img[class="rnb-col-3-img"] {
            max-width: 170px;
        }

        /* Image width by default for 2 columns */

        img[class="rnb-col-2-img"] {
            max-width: 264px;
        }

        /* Image width by default for 2 columns aside small size */

        img[class="rnb-col-2-img-side-xs"] {
            max-width: 180px;
        }

        /* Image width by default for 2 columns aside big size */

        img[class="rnb-col-2-img-side-xl"] {
            max-width: 350px;
        }

        /* Image width by default for 1 column */

        img[class="rnb-col-1-img"] {
            max-width: 550px;
        }

        /* Image width by default for header */

        img[class="rnb-header-img"] {
            max-width: 590px;
        }

        /* Ckeditor line-height spacing */

        .rnb-force-col p,
        ul,
        ol {
            margin: 0px !important;
        }

        .rnb-del-min-width p,
        ul,
        ol {
            margin: 0px !important;
        }

        /* tmpl-2 preview */

        .rnb-tmpl-width {
            width: 100% !important;
        }

        /* tmpl-11 preview */

        .rnb-social-width {
            padding-right: 15px !important;
        }

        /* tmpl-11 preview */

        .rnb-social-align {
            float: right !important;
        }

        /* Ul Li outlook extra spacing fix */

        li {
            mso-margin-top-alt: 0;
            mso-margin-bottom-alt: 0;
        }

        /* Outlook fix */

        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        /* Outlook fix */

        table,
        tr,
        td {
            border-collapse: collapse;
        }

        /* Outlook fix */

        p,
        a,
        li,
        blockquote {
            mso-line-height-rule: exactly;
        }

        /* Outlook fix */

        .msib-right-img {
            mso-padding-alt: 0 !important;
        }

        /* Fix text line height on preview */

        .content-spacing div {
            display: list-item;
            list-style-type: none;
        }

        @media only screen and (min-width:590px) {

            /* mac fix width */
            .templateContainer {
                width: 590px !important;
            }
        }

        @media screen and (max-width: 360px) {

            /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
            .rnb-yahoo-width {
                width: 360px !important;
            }
        }

        @media screen and (max-width: 380px) {

            /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
            .element-img-text {
                font-size: 24px !important;
            }

            .element-img-text2 {
                width: 230px !important;
            }

            .content-img-text-tmpl-6 {
                font-size: 24px !important;
            }

            .content-img-text2-tmpl-6 {
                width: 220px !important;
            }
        }

        @media screen and (max-width: 480px) {
            td[class="rnb-container-padding"] {
                padding-left: 10px !important;
                padding-right: 10px !important;
            }

            /* force container nav to (horizontal) blocks */
            td.rnb-force-nav {
                display: inherit;
            }

            /* fix text alignment "tmpl-11" in mobile preview */
            .rnb-social-text-left {
                width: 100%;
                text-align: center;
                margin-bottom: 15px;
            }

            .rnb-social-text-right {
                width: 100%;
                text-align: center;
            }
        }

        @media only screen and (max-width: 600px) {

            /* center the address &amp; social icons */
            .rnb-text-center {
                text-align: center !important;
            }

            /* force container columns to (horizontal) blocks */
            th.rnb-force-col {
                display: block;
                padding-right: 0 !important;
                padding-left: 0 !important;
                width: 100%;
            }

            table.rnb-container {
                width: 100% !important;
            }

            table.rnb-btn-col-content {
                width: 100% !important;
            }

            table.rnb-col-3 {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
                /* change left/right padding and margins to top/bottom ones */
                margin-bottom: 10px;
                padding-bottom: 10px;
                /*border-bottom: 1px solid #eee;*/
            }

            table.rnb-last-col-3 {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
            }

            table.rnb-col-2 {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
                /* change left/right padding and margins to top/bottom ones */
                margin-bottom: 10px;
                padding-bottom: 10px;
                /*border-bottom: 1px solid #eee;*/
            }

            table.rnb-col-2-noborder-onright {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
                /* change left/right padding and margins to top/bottom ones */
                margin-bottom: 10px;
                padding-bottom: 10px;
            }

            table.rnb-col-2-noborder-onleft {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
                /* change left/right padding and margins to top/bottom ones */
                margin-top: 10px;
                padding-top: 10px;
            }

            table.rnb-last-col-2 {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
            }

            table.rnb-col-1 {
                /* unset table align="left/right" */
                float: none !important;
                width: 100% !important;
            }

            img.rnb-col-3-img {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            img.rnb-col-2-img {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            img.rnb-col-2-img-side-xs {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            img.rnb-col-2-img-side-xl {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            img.rnb-col-1-img {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            img.rnb-header-img {
                /**max-width:none !important;**/
                width: 100% !important;
                margin: 0 auto;
            }

            img.rnb-logo-img {
                /**max-width:none !important;**/
                width: 100% !important;
            }

            td.rnb-mbl-float-none {
                float: inherit !important;
            }

            .img-block-center {
                text-align: center !important;
            }

            .logo-img-center {
                float: inherit !important;
            }

            /* tmpl-11 preview */
            .rnb-social-align {
                margin: 0 auto !important;
                float: inherit !important;
            }

            /* tmpl-11 preview */
            .rnb-social-center {
                display: inline-block;
            }

            /* tmpl-11 preview */
            .social-text-spacing {
                margin-bottom: 0px !important;
                padding-bottom: 0px !important;
            }

            /* tmpl-11 preview */
            .social-text-spacing2 {
                padding-top: 15px !important;
            }
        }
    </style>

    <style type="text/css">
        table {
            border-spacing: 0;
        }

        table td {
            border-collapse: collapse;
        }
    </style>
</head>

<body>

    <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template"
        bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">

        <tbody>
            <tr style="display:none !important; font-size:1px; mso-hide: all;">
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td align="center" valign="top">

                    <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer"
                        style="max-width:590px!important; width: 590px;">
                        <tbody>
                            <tr>

                                <td align="center" valign="top">

                                    <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                        cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                                        <tbody>
                                            <tr>
                                                <td class="rnb-del-min-width" valign="top" align="center"
                                                    style="min-width:590px;">
                                                    <table width="100%" cellpadding="0" border="0" height="38"
                                                        cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" height="38">
                                                                    <img width="20" height="38"
                                                                        style="display:block; max-height:38px; max-width:20px;"
                                                                        alt=""
                                                                        src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                            cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        style="min-width:590px;">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                            class="rnb-container" bgcolor="#ffffff"
                                                            style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        align="left">
                                                                        <table width="100%" cellpadding="0" border="0"
                                                                            align="center" cellspacing="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" align="center">
                                                                                        <table cellpadding="0"
                                                                                            border="0" align="center"
                                                                                            cellspacing="0"
                                                                                            class="logo-img-center">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="middle"
                                                                                                        align="center"
                                                                                                        style="line-height: 1px;">
                                                                                                        <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; "
                                                                                                            cellspacing="0"
                                                                                                            cellpadding="0"
                                                                                                            border="0">
                                                                                                            <div>
                                                                                                                <a style="text-decoration:none;"
                                                                                                                    target="_blank"
                                                                                                                    href="https://example.com/"><img
                                                                                                                        width="209"
                                                                                                                        vspace="0"
                                                                                                                        hspace="0"
                                                                                                                        border="0"
                                                                                                                        alt="Company Inc."
                                                                                                                        style="float: left;max-width:209px;"
                                                                                                                        class="rnb-logo-img"
                                                                                                                        src="{{logo}}"></a>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_"
                                            id="Layout_">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table border="0" width="100%" cellpadding="0" cellspacing="0"
                                                            class="rnb-container" bgcolor="#ffffff"
                                                            style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="rnb-container-padding"
                                                                        style="font-size: px;font-family: ; color: ;">

                                                                        <table border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container" align="center"
                                                                            style="margin:auto;">
                                                                            <tbody>
                                                                                <tr>

                                                                                    <th class="rnb-force-col"
                                                                                        align="center">

                                                                                        <table border="0"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0"
                                                                                            align="center"
                                                                                            class="rnb-col-1">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td height="10">
                                                                                                    </td>
                                                                                                </tr>

                                                                                                <tr>
                                                                                                    <td class="content-spacing"
                                                                                                        style="font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:center;">

                                                                                                        <span
                                                                                                            style="color:#3c4858;"><span
                                                                                                                style="color:#008000;"><strong><span
                                                                                                                        style="font-size:24px;">Your OTP
                                                                                                                    </span></strong>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td height="10">
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                            cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        style="min-width:590px;">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                            class="mso-button-block rnb-container"
                                                            style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        align="left">

                                                                        <table width="100%" border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th class="rnb-force-col"
                                                                                        valign="top">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="550"
                                                                                            align="center"
                                                                                            class="rnb-col-1">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="center"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content"
                                                                                                            style="margin:auto; border-collapse: separate;">
                                                                                                            <tbody>
                                                                                                                <tr
                                                                                                                    style="font-size: 14px;font-family: Arial,Helvetica,sans-serif,sans-serif;color: #3c4858;line-height: 21px;">
                                                                                                                    <td width="auto"
                                                                                                                        valign="middle">
                                                                                                                        {{otp}}
                                                                                                                    </td>
                                                                                                                </tr>

                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                        cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                        <tbody>
                                            <tr>
                                                <td class="rnb-del-min-width" valign="top" align="center"
                                                    style="min-width:590px;">
                                                    <table width="100%" cellpadding="0" border="0" height="30"
                                                        cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" height="30">
                                                                    <img width="20" height="30"
                                                                        style="display:block; max-height:30px; max-width:20px;"
                                                                        alt=""
                                                                        src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                            cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                            class="rnb-container" bgcolor="#ffffff"
                                                            style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        align="left">

                                                                        <table width="100%" border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container">
                                                                            <tbody>
                                                                                <tr>

                                                                                    <th class="rnb-force-col img-block-center"
                                                                                        style="text-align: left; font-weight: normal; padding-right: 20px;"
                                                                                        valign="top" width="180">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" align="left"
                                                                                            class="rnb-col-2-noborder-onright"
                                                                                            width="180">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="100%"
                                                                                                        style="line-height: 1px;"
                                                                                                        class="img-block-center"
                                                                                                        valign="top"
                                                                                                        align="left">
                                                                                                        <div
                                                                                                            style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;">
                                                                                                            <div><img
                                                                                                                    alt=""
                                                                                                                    border="0"
                                                                                                                    hspace="0"
                                                                                                                    vspace="0"
                                                                                                                    width="180"
                                                                                                                    style="vertical-align:top; float: left; width:180px;max-width:180px !important; "
                                                                                                                    class="rnb-col-2-img-side-xl"
                                                                                                                    src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg">
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style="clear:both;">
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                    <th class="rnb-force-col"
                                                                                        style="text-align: left; font-weight: normal"
                                                                                        valign="top">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="350"
                                                                                            align="left"
                                                                                            class="rnb-last-col-2">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                                                                        <span
                                                                                                            style="color:#3c4858; "><span
                                                                                                                style="font-size: 18px;"><b>Feel
                                                                                                                    free
                                                                                                                    to
                                                                                                                    reach
                                                                                                                    out
                                                                                                                    to
                                                                                                                    us&nbsp;</b></span></span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td height="10"
                                                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                                        &nbsp;</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="rnb-mbl-float-none"
                                                                                                        style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;">
                                                                                                        <div>Keep
                                                                                                            exploring
                                                                                                            around and
                                                                                                            let us know
                                                                                                            if you need
                                                                                                            any help. We
                                                                                                            can be
                                                                                                            approached
                                                                                                            via
                                                                                                            following
                                                                                                            ways.</div>

                                                                                                        <div><span
                                                                                                                style="background-color: transparent;">Email
                                                                                                                us -
                                                                                                                support@example.com,
                                                                                                            </span>
                                                                                                        </div>

                                                                                                        <div><span
                                                                                                                style="background-color: transparent;">Call
                                                                                                                us - +14157078933.</span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>

                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->

                                        <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                            cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        style="min-width:590px;">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                            class="mso-button-block rnb-container"
                                                            style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        align="left">

                                                                        <table width="100%" border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th class="rnb-force-col"
                                                                                        valign="top">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="550"
                                                                                            align="center"
                                                                                            class="rnb-col-1">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="center"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content"
                                                                                                            style="margin:auto; border-collapse: separate;">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="auto"
                                                                                                                        valign="middle"
                                                                                                                        bgcolor="#f56b58"
                                                                                                                        align="center"
                                                                                                                        height="40"
                                                                                                                        style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                        <span
                                                                                                                            style="color:#ffffff; font-weight:normal;">
                                                                                                                            <a style="text-decoration:none; color:#ffffff; font-weight:normal;" href="https://student.example.com/" target="_blank">Student Login!!!</a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="center"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content"
                                                                                                            style="margin:auto; border-collapse: separate;">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="auto"
                                                                                                                        valign="middle"
                                                                                                                        bgcolor="#f56b58"
                                                                                                                        align="center"
                                                                                                                        height="40"
                                                                                                                        style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                        <span
                                                                                                                            style="color:#ffffff; font-weight:normal;">
                                                                                                                            <a style="text-decoration:none; color:#ffffff; font-weight:normal;" href="https://tutor.example.com/" target="_blank">Tutor Login!!!</a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(249, 250, 252);">

                                        <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                            border="0" cellspacing="0" style="min-width:590px;" name="Layout_"
                                            id="Layout_">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        bgcolor="#f9fafc"
                                                        style="min-width: 590px; background-color: rgb(249, 250, 252);">
                                                        <table width="590" class="rnb-container" cellpadding="0"
                                                            border="0" align="center" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;"
                                                                        align="left">

                                                                        <table width="100%" border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th class="rnb-force-col"
                                                                                        style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;"
                                                                                        valign="top">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="264"
                                                                                            align="left"
                                                                                            class="rnb-col-2 rnb-social-text-left"
                                                                                            style="border-bottom:0;">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="left"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td valign="middle"
                                                                                                                        align="left"
                                                                                                                        style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px"
                                                                                                                        class="rnb-text-center">
                                                                                                                        <div>
                                                                                                                            <div>platform.example.com&nbsp;</div>
                                                                                                                            <div>340 S Lemon Ave,</div>
                                                                                                                            <div>#9894 Walnut,</div>
                                                                                                                            <div>Ca 91789</div>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                    <th ng-if="item.text.align=='left'"
                                                                                        class="rnb-force-col rnb-social-width"
                                                                                        valign="top"
                                                                                        style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="246"
                                                                                            align="right"
                                                                                            class="rnb-last-col-2">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-social-align"
                                                                                                            style="float: right;"
                                                                                                            align="right">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td valign="middle"
                                                                                                                        class="rnb-text-center"
                                                                                                                        ng-init="width=setSocialIconsBlockWidth(item)"
                                                                                                                        width="125"
                                                                                                                        align="right">
                                                                                                                        <div
                                                                                                                            class="rnb-social-center">
                                                                                                                            <table
                                                                                                                                align="left"
                                                                                                                                style="float:left; display: inline-block"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0">
                                                                                                                                <tbody>
                                                                                                                                    <tr>
                                                                                                                                        <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                            align="left">
                                                                                                                                            <span
                                                                                                                                                style="color:#ffffff; font-weight:normal;">
                                                                                                                                                <a target="_blank"
                                                                                                                                                    href="https://www.facebook.com/Utobians"><img
                                                                                                                                                        alt="Facebook"
                                                                                                                                                        border="0"
                                                                                                                                                        hspace="0"
                                                                                                                                                        vspace="0"
                                                                                                                                                        style="vertical-align:top;"
                                                                                                                                                        target="_blank"
                                                                                                                                                        src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </tbody>
                                                                                                                            </table>
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            class="rnb-social-center">
                                                                                                                            <table
                                                                                                                                align="left"
                                                                                                                                style="float:left; display: inline-block"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0">
                                                                                                                                <tbody>
                                                                                                                                    <tr>
                                                                                                                                        <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                            align="left">
                                                                                                                                            <span
                                                                                                                                                style="color:#ffffff; font-weight:normal;">
                                                                                                                                                <a target="_blank"
                                                                                                                                                    href="https://www.linkedin.com/company/company/"><img
                                                                                                                                                        alt="Twitter"
                                                                                                                                                        border="0"
                                                                                                                                                        hspace="0"
                                                                                                                                                        vspace="0"
                                                                                                                                                        style="vertical-align:top;"
                                                                                                                                                        target="_blank"
                                                                                                                                                        src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </tbody>
                                                                                                                            </table>
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            class="rnb-social-center">
                                                                                                                            <table
                                                                                                                                align="left"
                                                                                                                                style="float:left; display: inline-block"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0">
                                                                                                                                <tbody>
                                                                                                                                    <tr>
                                                                                                                                        <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                            align="left">
                                                                                                                                            <span
                                                                                                                                                style="color:#ffffff; font-weight:normal;">
                                                                                                                                                <a target="_blank"
                                                                                                                                                    href="https://www.linkedin.com/company/company/"><img
                                                                                                                                                        alt="LinkedIn"
                                                                                                                                                        border="0"
                                                                                                                                                        hspace="0"
                                                                                                                                                        vspace="0"
                                                                                                                                                        style="vertical-align:top;"
                                                                                                                                                        target="_blank"
                                                                                                                                                        src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </tbody>
                                                                                                                            </table>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(249, 250, 252);">

                                        <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                            border="0" cellspacing="0" style="min-width:590px;" name="Layout_3"
                                            id="Layout_3">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        bgcolor="#f9fafc"
                                                        style="min-width:590px; background-color: #f9fafc; text-align: center;">
                                                        <table width="590" class="rnb-container" cellpadding="0"
                                                            border="0" align="center" cellspacing="0" bgcolor="#f9fafc"
                                                            style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="10"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <div
                                                                            style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                            <div>This email was sent to {{ contact.EMAIL
                                                                                }}
                                                                                <div>You received this email because
                                                                                    have signed up on
                                                                                    www.example.com&nbsp;</div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            style="display: block; text-align: center;">
                                                                            <span
                                                                                style="font-size:14px; font-weight:normal; display: inline-block; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                <a style="text-decoration:underline; color:#666666;font-size:14px;font-weight:normal;font-family:Arial,Helvetica,sans-serif;"
                                                                                    target="_blank"
                                                                                    href="{{ unsubscribe }}">Unsubscribe
                                                                                    here</a>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="10"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(249, 250, 252);">

                                        <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                            border="0" cellspacing="0" style="min-width:590px;" name="Layout_4"
                                            id="Layout_4">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" align="center"
                                                            cellspacing="0" bgcolor="#f9fafc"
                                                            style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                        <div>©2021 Company Inc.</div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td align="center" valign="top">

                                    <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                        cellspacing="0" style="min-width:590px;" name="Layout_3971" id="Layout_3971">
                                        <tbody>
                                            <tr>
                                                <td class="rnb-del-min-width" valign="top" align="center"
                                                    style="min-width:590px;">
                                                    <table width="100%" cellpadding="0" border="0" height="38"
                                                        cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" height="38">
                                                                    <img width="20" height="38"
                                                                        style="display:block; max-height:38px; max-width:20px;"
                                                                        alt=""
                                                                        src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if gte mso 9]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>`;

    var template = handlebars.compile(htmlContent);
    var replacements = {
        otp: otp,
        emailId: emailId,
        logo: 'https://img.mailinblue.com/2598720/images/rnb/original/5e47eadb9967ccbc76710418.png'
    };
    var htmlToSend = template(replacements);

    let emailInfo = {
        from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
        to: emailId,
        subject: 'Company OTP',
        html: htmlToSend
    }
    let info = await to(transporter.sendMail(emailInfo));
    return info;
}

// When institute register at that time mail
module.exports.SendInstituteRegisterEMail = async function (emailId, instituteName) {

    let transporter = nodemailer.createTransport({
        pool: true,
        host: CONFIG.SMTP_Host,
        port: CONFIG.SMTP_Port,
        secure: true,
        auth: {
            user: CONFIG.SMTP_UserEmail,
            pass: CONFIG.SMTP_UserPassword
        }
    });

    const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <title></title>
        <style type="text/css">
            /* Resets */
            
            .ReadMsgBody {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass {
                width: 100%;
                background-color: #ebebeb;
            }
            
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
            
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            
            body {
                -webkit-text-size-adjust: none;
                -ms-text-size-adjust: none;
            }
            
            body {
                margin: 0;
                padding: 0;
            }
            
            .yshortcuts a {
                border-bottom: none !important;
            }
            
            .rnb-del-min-width {
                min-width: 0 !important;
            }
            /* Add new outlook css start */
            
            .templateContainer {
                max-width: 590px !important;
                width: auto !important;
            }
            /* Add new outlook css end */
            /* Image width by default for 3 columns */
            
            img[class="rnb-col-3-img"] {
                max-width: 170px;
            }
            /* Image width by default for 2 columns */
            
            img[class="rnb-col-2-img"] {
                max-width: 264px;
            }
            /* Image width by default for 2 columns aside small size */
            
            img[class="rnb-col-2-img-side-xs"] {
                max-width: 180px;
            }
            /* Image width by default for 2 columns aside big size */
            
            img[class="rnb-col-2-img-side-xl"] {
                max-width: 350px;
            }
            /* Image width by default for 1 column */
            
            img[class="rnb-col-1-img"] {
                max-width: 550px;
            }
            /* Image width by default for header */
            
            img[class="rnb-header-img"] {
                max-width: 590px;
            }
            /* Ckeditor line-height spacing */
            
            .rnb-force-col p,
            ul,
            ol {
                margin: 0px!important;
            }
            
            .rnb-del-min-width p,
            ul,
            ol {
                margin: 0px!important;
            }
            /* tmpl-2 preview */
            
            .rnb-tmpl-width {
                width: 100%!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-width {
                padding-right: 15px!important;
            }
            /* tmpl-11 preview */
            
            .rnb-social-align {
                float: right!important;
            }
            /* Ul Li outlook extra spacing fix */
            
            li {
                mso-margin-top-alt: 0;
                mso-margin-bottom-alt: 0;
            }
            /* Outlook fix */
            
            table {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            /* Outlook fix */
            
            table,
            tr,
            td {
                border-collapse: collapse;
            }
            /* Outlook fix */
            
            p,
            a,
            li,
            blockquote {
                mso-line-height-rule: exactly;
            }
            /* Outlook fix */
            
            .msib-right-img {
                mso-padding-alt: 0 !important;
            }
            /* Fix text line height on preview */
            
            .content-spacing div {
                display: list-item;
                list-style-type: none;
            }
            
            @media only screen and (min-width:590px) {
                /* mac fix width */
                .templateContainer {
                    width: 590px !important;
                }
            }
            
            @media screen and (max-width: 360px) {
                /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
                .rnb-yahoo-width {
                    width: 360px !important;
                }
            }
            
            @media screen and (max-width: 380px) {
                /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
                .element-img-text {
                    font-size: 24px !important;
                }
                .element-img-text2 {
                    width: 230px !important;
                }
                .content-img-text-tmpl-6 {
                    font-size: 24px !important;
                }
                .content-img-text2-tmpl-6 {
                    width: 220px !important;
                }
            }
            
            @media screen and (max-width: 480px) {
                td[class="rnb-container-padding"] {
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                }
                /* force container nav to (horizontal) blocks */
                td.rnb-force-nav {
                    display: inherit;
                }
                /* fix text alignment "tmpl-11" in mobile preview */
                .rnb-social-text-left {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .rnb-social-text-right {
                    width: 100%;
                    text-align: center;
                }
            }
            
            @media only screen and (max-width: 600px) {
                /* center the address &amp; social icons */
                .rnb-text-center {
                    text-align: center !important;
                }
                /* force container columns to (horizontal) blocks */
                th.rnb-force-col {
                    display: block;
                    padding-right: 0 !important;
                    padding-left: 0 !important;
                    width: 100%;
                }
                table.rnb-container {
                    width: 100% !important;
                }
                table.rnb-btn-col-content {
                    width: 100% !important;
                }
                table.rnb-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-last-col-3 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    /*border-bottom: 1px solid #eee;*/
                }
                table.rnb-col-2-noborder-onright {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                }
                table.rnb-col-2-noborder-onleft {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                    /* change left/right padding and margins to top/bottom ones */
                    margin-top: 10px;
                    padding-top: 10px;
                }
                table.rnb-last-col-2 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                table.rnb-col-1 {
                    /* unset table align="left/right" */
                    float: none !important;
                    width: 100% !important;
                }
                img.rnb-col-3-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xs {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-2-img-side-xl {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-col-1-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                img.rnb-header-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                    margin: 0 auto;
                }
                img.rnb-logo-img {
                    /**max-width:none !important;**/
                    width: 100% !important;
                }
                td.rnb-mbl-float-none {
                    float: inherit !important;
                }
                .img-block-center {
                    text-align: center !important;
                }
                .logo-img-center {
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-align {
                    margin: 0 auto !important;
                    float: inherit !important;
                }
                /* tmpl-11 preview */
                .rnb-social-center {
                    display: inline-block;
                }
                /* tmpl-11 preview */
                .social-text-spacing {
                    margin-bottom: 0px !important;
                    padding-bottom: 0px !important;
                }
                /* tmpl-11 preview */
                .social-text-spacing2 {
                    padding-top: 15px !important;
                }
            }
        </style>
        <!--[if gte mso 11]><style type="text/css">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]-->
        <!--[if !mso]><!-->
        <style type="text/css">
            table {
                border-spacing: 0;
            }
            
            table td {
                border-collapse: collapse;
            }
        </style>
        <!--<![endif]-->
        <!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head>
    
    <body>
    
        <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template" bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">
    
            <tbody>
                <tr style="display:none !important; font-size:1px; mso-hide: all;">
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <!--[if gte mso 9]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="590" style="width:590px;">
                            <tr>
                            <td align="center" valign="top" width="590" style="width:590px;">
                            <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer" style="max-width:590px!important; width: 590px;">
                            <tbody>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                                                        <table width="100%" cellpadding="0" border="0" height="18" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td valign="top" height="18">
                                                                        <img width="20" height="18" style="display:block; max-height:18px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
                                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td valign="top" align="center">
                                                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="logo-img-center">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="middle" align="center" style="line-height: 1px;">
                                                                                                            <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; " cellspacing="0" cellpadding="0" border="0">
                                                                                                                <div>
                                                                                                                    <a style="text-decoration:none;" target="_blank" href="https://example.com/"><img width="209" vspace="0" hspace="0" border="0" alt="Company Inc." style="float: left;max-width:209px;" class="rnb-logo-img" src="https://example.com/img/logo/logo.png"></a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
    
                                            <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" width="100%" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="rnb-container-padding" style="font-size: px;font-family: ; color: ;">
    
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container" align="center" style="margin:auto;">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col" align="center">
    
                                                                                            <table border="0" cellspacing="0" cellpadding="0" align="center" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
    
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:center;">
    
                                                                                                            <span style="color:#3c4858;"><font color="#008000"><span style="font-size: 24px;"><b>Welcome to the family!</b></span></font>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
    
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
    
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_5">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);">
    
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal; padding-right: 0px;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="100%" align="left" class="rnb-col-1">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="content-spacing" style="font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858; line-height: 21px;">
                                                                                                            <div style="text-align: justify;"><span style="font-size:16px;">We are super excited to inform you that we have successfully created your account with example.com.<br>
                                                                                                            <br>
                                                                                                            Ssshhh! We don't tell any private information to anyone.<br>
                                                                                                            Please login to tutor.example.com using your email address or mobile number and the password you chose while Signing Up with us. </span></div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
    
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
    
                                            <!--[if mso 15]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top">
                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
    
                                                                                        <th class="rnb-force-col img-block-center" style="text-align: left; font-weight: normal; padding-right: 20px;" valign="top" width="180">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" align="left" class="rnb-col-2-noborder-onright" width="180">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="100%" style="line-height: 1px;" class="img-block-center" valign="top" align="left">
                                                                                                            <div style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;">
                                                                                                                <div><img alt="" border="0" hspace="0" vspace="0" width="180" style="vertical-align:top; float: left; width:180px;max-width:180px !important; " class="rnb-col-2-img-side-xl" src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg"></div>
                                                                                                                <div style="clear:both;"></div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="350" align="left" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                                                                            <span style="color:#3c4858; "><span style="font-size: 18px;"><b>Feel free to reach out to us&nbsp;</b></span></span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td class="rnb-mbl-float-none" style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;">
                                                                                                            <div>We swear on our laptop to equip our customers with best in class information technology products at the lowest possible prices, deliver it in just in time and offer exceptional support.</div>
    
                                                                                                            <div>&nbsp;</div>
    
                                                                                                            <div>Email: support@example.com</div>
    
                                                                                                            <div>Call: +14157078933</div>
    
                                                                                                            <div>Schedule a call with CEO – https://meetings.hubspot.com/raj-company/30-mins</div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
    
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if mso 15]>
                    </td>
                    <![endif]-->
    
                                            <!--[if mso 15]>
                    </tr>
                    </table>
                    <![endif]-->
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>

                                <td align="center" valign="top">

                                    <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">

                                        <!--[if mso]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->

                                        <!--[if mso]>
                    <td valign="top" width="590" style="width:590px;">
                    <![endif]-->
                                        <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                            cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                            <tbody>
                                                <tr>
                                                    <td class="rnb-del-min-width" align="center" valign="top"
                                                        style="min-width:590px;">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                            class="mso-button-block rnb-container"
                                                            style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                            <tbody>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top" class="rnb-container-padding"
                                                                        align="left">

                                                                        <table width="100%" border="0" cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="rnb-columns-container">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th class="rnb-force-col"
                                                                                        valign="top">

                                                                                        <table border="0" valign="top"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" width="550"
                                                                                            align="center"
                                                                                            class="rnb-col-1">

                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="center"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content"
                                                                                                            style="margin:auto; border-collapse: separate;">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="auto"
                                                                                                                        valign="middle"
                                                                                                                        bgcolor="#f56b58"
                                                                                                                        align="center"
                                                                                                                        height="40"
                                                                                                                        style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                        <span
                                                                                                                            style="color:#ffffff; font-weight:normal;">
                                                                                                                            <a style="text-decoration:none; color:#ffffff; font-weight:normal;" href="https://student.example.com/" target="_blank">Student Login!!!</a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                    <td valign="top">
                                                                                                        <table
                                                                                                            cellpadding="0"
                                                                                                            border="0"
                                                                                                            align="center"
                                                                                                            cellspacing="0"
                                                                                                            class="rnb-btn-col-content"
                                                                                                            style="margin:auto; border-collapse: separate;">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="auto"
                                                                                                                        valign="middle"
                                                                                                                        bgcolor="#f56b58"
                                                                                                                        align="center"
                                                                                                                        height="40"
                                                                                                                        style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                        <span
                                                                                                                            style="color:#ffffff; font-weight:normal;">
                                                                                                                            <a style="text-decoration:none; color:#ffffff; font-weight:normal;" href="https://tutor.example.com/" target="_blank">Tutor Login!!!</a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height="20"
                                                                        style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                        &nbsp;</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width: 590px; background-color: rgb(249, 250, 252);">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" class="rnb-container-padding" style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;" align="left">
    
                                                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th class="rnb-force-col" style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;" valign="top">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="264" align="left" class="rnb-col-2 rnb-social-text-left" style="border-bottom:0;">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" align="left" cellspacing="0" class="rnb-btn-col-content">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" align="left" style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px" class="rnb-text-center">
                                                                                                                            <div>
                                                                                                                                <div>platform.example.com&nbsp;</div>
                                                                                                                                <div>340 S Lemon Ave,</div>
                                                                                                                                <div>#9894 Walnut,</div>
                                                                                                                                <div>Ca 91789</div>
                                                                                                                            </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th ng-if="item.text.align=='left'" class="rnb-force-col rnb-social-width" valign="top" style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">
    
                                                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="246" align="right" class="rnb-last-col-2">
    
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <table cellpadding="0" border="0" cellspacing="0" class="rnb-social-align" style="float: right;" align="right">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td valign="middle" class="rnb-text-center" ng-init="width=setSocialIconsBlockWidth(item)" width="125" align="right">
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
                                                                                    <a target="_blank" href="https://www.facebook.com/Utobians"><img alt="Facebook" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a></span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
                                                                                    <a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="Twitter" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a></span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div class="rnb-social-center">
                                                                                                                                <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                                                                                                <span style="color:#ffffff; font-weight:normal;">
                                                                                    <a target="_blank" href="https://www.linkedin.com/company/edtech-platform"><img alt="LinkedIn" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a></span>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
    
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3" id="Layout_3">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width:590px; background-color: #f9fafc; text-align: center;">
                                                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                <div>This email was sent to {{ contact.EMAIL }}
                                                                                    <div>You received this email because have signed up on www.example.com&nbsp;</div>
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: block; text-align: center;">
                                                                                <span style="font-size:14px; font-weight:normal; display: inline-block; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                    <a style="text-decoration:underline; color:#666666;font-size:14px;font-weight:normal;font-family:Arial,Helvetica,sans-serif;" target="_blank" href="{{ unsubscribe }}">Unsubscribe here</a></span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                                <tr>
    
                                    <td align="center" valign="top">
    
                                        <div style="background-color: rgb(249, 250, 252);">
    
                                            <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_4" id="Layout_4">
                                                <tbody>
                                                    <tr>
                                                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                                                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                            <div>©2021 Company Inc.</div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
    
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--[if gte mso 9]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    
    </body>
    
    </html>`;

    let emailInfo = {
        from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
        to: '"' + instituteName + '" ' + emailId,
        subject: 'Your account has been created successfully with platform.example.com.',
        html: htmlContent
    }
    let info = await to(transporter.sendMail(emailInfo));

    if (err) this.TE(err.message);
    return info;
}

// While Institute Purchase any plan at that time mail
module.exports.SendMailUsingTOA = async function (name, emailId, subject, htmlContent) {

    let transporter = nodemailer.createTransport({
        pool: true,
        host: CONFIG.SMTP_Host,
        port: CONFIG.SMTP_Port,
        secure: true,
        auth: {
            user: CONFIG.SMTP_UserEmail,
            pass: CONFIG.SMTP_UserPassword
        }
    });

    let emailInfo = {
        from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
        to: '"' + name + '" ' + emailId,
        subject: subject,
        html: htmlContent
    }
    let info = await to(transporter.sendMail(emailInfo));
    if (err) this.TE(err.message);
    return info;
}

module.exports.SendContentPurchaseEmail = async function (user, details) {

    if (user.email) {


        let name = user.first_name + ' ' + user.last_name;
        let subject = 'We at ' + details.account.title + ' are so happy to be your learning partner';

        let htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="x-apple-disable-message-reformatting" /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="black" /><meta name="format-detection" content="telephone=no" /><title></title><style type="text/css">
        /* Resets */
        .ReadMsgBody { width: 100%; background-color: #ebebeb;}
        .ExternalClass {width: 100%; background-color: #ebebeb;}
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height:100%;}
        a[x-apple-data-detectors]{
            color:inherit !important;
            text-decoration:none !important;
            font-size:inherit !important;
            font-family:inherit !important;
            font-weight:inherit !important;
            line-height:inherit !important;
        }        
        body {-webkit-text-size-adjust:none; -ms-text-size-adjust:none;}
        body {margin:0; padding:0;}
        .yshortcuts a {border-bottom: none !important;}
        .rnb-del-min-width{ min-width: 0 !important; }
    
        /* Add new outlook css start */
        .templateContainer{
            max-width:590px !important;
            width:auto !important;
        }
        /* Add new outlook css end */
    
        /* Image width by default for 3 columns */
        img[class="rnb-col-3-img"] {
        max-width:170px;
        }
    
        /* Image width by default for 2 columns */
        img[class="rnb-col-2-img"] {
        max-width:264px;
        }
    
        /* Image width by default for 2 columns aside small size */
        img[class="rnb-col-2-img-side-xs"] {
        max-width:180px;
        }
    
        /* Image width by default for 2 columns aside big size */
        img[class="rnb-col-2-img-side-xl"] {
        max-width:350px;
        }
    
        /* Image width by default for 1 column */
        img[class="rnb-col-1-img"] {
        max-width:550px;
        }
    
        /* Image width by default for header */
        img[class="rnb-header-img"] {
        max-width:590px;
        }
    
        /* Ckeditor line-height spacing */
        .rnb-force-col p, ul, ol{margin:0px!important;}
        .rnb-del-min-width p, ul, ol{margin:0px!important;}
    
        /* tmpl-2 preview */
        .rnb-tmpl-width{ width:100%!important;}
    
        /* tmpl-11 preview */
        .rnb-social-width{padding-right:15px!important;}
    
        /* tmpl-11 preview */
        .rnb-social-align{float:right!important;}
    
        /* Ul Li outlook extra spacing fix */
        li{mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;}        
    
        /* Outlook fix */
        table {mso-table-lspace:0pt; mso-table-rspace:0pt;}
    
        /* Outlook fix */
        table, tr, td {border-collapse: collapse;}
    
        /* Outlook fix */
        p,a,li,blockquote {mso-line-height-rule:exactly;} 
    
        /* Outlook fix */
        .msib-right-img { mso-padding-alt: 0 !important;}
    
        /* Fix text line height on preview */ 
        .content-spacing div {display: list-item; list-style-type: none;}
    
        @media only screen and (min-width:590px){
        /* mac fix width */
        .templateContainer{width:590px !important;}
        }
    
        @media screen and (max-width: 360px){
        /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
        .rnb-yahoo-width{ width:360px !important;}
        }
    
        @media screen and (max-width: 380px){
        /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
        .element-img-text{ font-size:24px !important;}
        .element-img-text2{ width:230px !important;}
        .content-img-text-tmpl-6{ font-size:24px !important;}
        .content-img-text2-tmpl-6{ width:220px !important;}
        }
    
        @media screen and (max-width: 480px) {
        td[class="rnb-container-padding"] {
        padding-left: 10px !important;
        padding-right: 10px !important;
        }
    
        /* force container nav to (horizontal) blocks */
        td.rnb-force-nav {
        display: inherit;
        }
    
        /* fix text alignment "tmpl-11" in mobile preview */
        .rnb-social-text-left {
        width: 100%;
        text-align: center;
        margin-bottom: 15px;
        }
        .rnb-social-text-right {
        width: 100%;
        text-align: center;
        }
        }
    
        @media only screen and (max-width: 600px) {
    
        /* center the address &amp; social icons */
        .rnb-text-center {text-align:center !important;}
    
        /* force container columns to (horizontal) blocks */
        th.rnb-force-col {
        display: block;
        padding-right: 0 !important;
        padding-left: 0 !important;
        width:100%;
        }
    
        table.rnb-container {
        width: 100% !important;
        }
    
        table.rnb-btn-col-content {
        width: 100% !important;
        }
        table.rnb-col-3 {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
    
        /* change left/right padding and margins to top/bottom ones */
        margin-bottom: 10px;
        padding-bottom: 10px;
        /*border-bottom: 1px solid #eee;*/
        }
    
        table.rnb-last-col-3 {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
        }
    
        table.rnb-col-2 {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
    
        /* change left/right padding and margins to top/bottom ones */
        margin-bottom: 10px;
        padding-bottom: 10px;
        /*border-bottom: 1px solid #eee;*/
        }
    
        table.rnb-col-2-noborder-onright {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
    
        /* change left/right padding and margins to top/bottom ones */
        margin-bottom: 10px;
        padding-bottom: 10px;
        }
    
        table.rnb-col-2-noborder-onleft {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
    
        /* change left/right padding and margins to top/bottom ones */
        margin-top: 10px;
        padding-top: 10px;
        }
    
        table.rnb-last-col-2 {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
        }
    
        table.rnb-col-1 {
        /* unset table align="left/right" */
        float: none !important;
        width: 100% !important;
        }
    
        img.rnb-col-3-img {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        img.rnb-col-2-img {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        img.rnb-col-2-img-side-xs {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        img.rnb-col-2-img-side-xl {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        img.rnb-col-1-img {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        img.rnb-header-img {
        /**max-width:none !important;**/
        width:100% !important;
        margin:0 auto;
        }
    
        img.rnb-logo-img {
        /**max-width:none !important;**/
        width:100% !important;
        }
    
        td.rnb-mbl-float-none {
        float:inherit !important;
        }
    
        .img-block-center{text-align:center !important;}
    
        .logo-img-center
        {
            float:inherit !important;
        }
    
        /* tmpl-11 preview */
        .rnb-social-align{margin:0 auto !important; float:inherit !important;}
    
        /* tmpl-11 preview */
        .rnb-social-center{display:inline-block;}
    
        /* tmpl-11 preview */
        .social-text-spacing{margin-bottom:0px !important; padding-bottom:0px !important;}
    
        /* tmpl-11 preview */
        .social-text-spacing2{padding-top:15px !important;}
    
    }</style><!--[if gte mso 11]><style type="text/css">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]--><!--[if !mso]><!--><style type="text/css">table{border-spacing: 0;} table td {border-collapse: collapse;}</style> <!--<![endif]--><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--></head><body>
    
    <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template" bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">
    
    <tbody><tr style="display:none !important; font-size:1px; mso-hide: all;"><td></td><td></td></tr><tr>
        <td align="center" valign="top">
        <!--[if gte mso 9]>
                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="590" style="width:590px;">
                        <tr>
                        <td align="center" valign="top" width="590" style="width:590px;">
                        <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer" style="max-width:590px!important; width: 590px;">
        <tbody><tr>
    
        <td align="center" valign="top">
    
            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                <tbody><tr>
                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                            <tbody><tr>
                                <td valign="top" height="38">
                                    <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            </td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
                
                <!--[if mso]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->
                
                <!--[if mso]>
                <td valign="top" width="590" style="width:590px;">
                <![endif]-->
                <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                <tbody><tr>
                    <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                            <tbody><tr>
                                <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td valign="top" class="rnb-container-padding" align="left">
                                    <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0">
                                        <tbody><tr>
                                            <td valign="top" align="center">
                                                <table cellpadding="0" border="0" align="center" cellspacing="0" class="logo-img-center"> 
                                                    <tbody><tr>
                                                        <td valign="middle" align="center" style="line-height: 1px;">
                                                            <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; " cellspacing="0" cellpadding="0" border="0"><div><a style="text-decoration:none;" target="_blank" href="https://example.com/"><img width="209" vspace="0" hspace="0" border="0" alt="Company Inc." style="float: left;max-width:209px;" class="rnb-logo-img" src="{{logo}}"></a></div>
                                                            </div></td>
                                                    </tr>
                                                </tbody></table>
                                                </td>
                                        </tr>
                                    </tbody></table></td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            <!--[if mso]>
                </td>
                <![endif]-->
                
                <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
            
        </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
                
                <!--[if mso]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->
                
                <!--[if mso]>
                <td valign="top" width="590" style="width:590px;">
                <![endif]-->
            
                <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_" id="Layout_"><tbody><tr>
                    <td align="center" valign="top"><table border="0" width="100%" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;"><tbody><tr>
                                <td class="rnb-container-padding" style="font-size: px;font-family: ; color: ;">
    
                                    <table border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container" align="center" style="margin:auto;">
                                        <tbody><tr>
    
                                            <th class="rnb-force-col" align="center">
    
                                                <table border="0" cellspacing="0" cellpadding="0" align="center" class="rnb-col-1">
    
                                                    <tbody><tr>
                                                        <td height="10"></td>
                                                    </tr>
    
                                                    <tr>
                                                        <td class="content-spacing" style="font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:center;">
    
                                                            <span style="color:#3c4858;"><span style="color:#008000;"><strong><span style="font-size:24px;">We're so happy you're here. </span></strong></span></span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="10"></td>
                                                    </tr>
                                                    </tbody></table>
                                                </th></tr>
                                    </tbody></table></td>
                            </tr>
    
                        </tbody></table>
    
                    </td>
                </tr>
    
            </tbody></table><!--[if mso]>
                </td>
                <![endif]-->
                
                <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
            
        </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
            
                <!--[if mso]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->
                
                <!--[if mso]>
                <td valign="top" width="590" style="width:590px;">
                <![endif]-->
                <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_5">
                <tbody><tr>
                    <td class="rnb-del-min-width" align="center" valign="top">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);">
    
                                        <tbody><tr>
                                            <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" class="rnb-container-padding" align="left">
    
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                                    <tbody><tr>
                                                        <th class="rnb-force-col" style="text-align: left; font-weight: normal; padding-right: 0px;" valign="top">
    
                                                            <table border="0" valign="top" cellspacing="0" cellpadding="0" width="100%" align="left" class="rnb-col-1">
    
                                                                <tbody><tr>
                                                                    <td class="content-spacing" style="font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858; line-height: 21px;"><div style="text-align: justify;"><span style="font-size:16px;">We are super excited to start a fantastic journey of learning new things together. We promise you to give a classroom experience with individual attention. We aspire to create a community where there are two-way communications in education.&nbsp;</span><span style="font-size: 16px; background-color: transparent;">please look at the profile section for an invoice.</span></div>
    </td>
                                                                </tr>
                                                                </tbody></table>
    
                                                            </th></tr>
                                                </tbody></table></td>
                                        </tr>
                                        <tr>
                                            <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                        </tr>
                                    </tbody></table>
                    </td>
                </tr>
            </tbody></table><!--[if mso]>
                </td>
                <![endif]-->
                
                <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
    
            </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                <tbody><tr>
                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                        <table width="100%" cellpadding="0" border="0" height="30" cellspacing="0">
                            <tbody><tr>
                                <td valign="top" height="30">
                                    <img width="20" height="30" style="display:block; max-height:30px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            </td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
                
                <!--[if mso 15]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->
                
                <!--[if mso 15]>
                <td valign="top" width="590" style="width:590px;">
                <![endif]-->
                <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                <tbody><tr>
                    <td class="rnb-del-min-width" align="center" valign="top">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-container" bgcolor="#ffffff" style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                            <tbody><tr>
                                <td valign="top" class="rnb-container-padding" align="left">
    
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                        <tbody><tr>
    
                                            <th class="rnb-force-col img-block-center" style="text-align: left; font-weight: normal; padding-right: 20px;" valign="top" width="180">
    
                                                <table border="0" valign="top" cellspacing="0" cellpadding="0" align="left" class="rnb-col-2-noborder-onright" width="180">
    
    
                                                    <tbody><tr>
                                                        <td width="100%" style="line-height: 1px;" class="img-block-center" valign="top" align="left">
                                                            <div style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;"><div><img alt="" border="0" hspace="0" vspace="0" width="180" style="vertical-align:top; float: left; width:180px;max-width:180px !important; " class="rnb-col-2-img-side-xl" src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg"></div><div style="clear:both;"></div></div></td>
                                                    </tr>
                                                    </tbody></table>
                                                </th><th class="rnb-force-col" style="text-align: left; font-weight: normal" valign="top">
    
                                                <table border="0" valign="top" cellspacing="0" cellpadding="0" width="350" align="left" class="rnb-last-col-2">
    
                                                    <tbody><tr>
                                                        <td style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                            <span style="color:#3c4858; "><span style="font-size: 18px;"><b>Feel free to reach out to us&nbsp;</b></span></span></td>
                                                    </tr><tr>
                                                        <td height="10" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                                    </tr><tr>
                                                        <td class="rnb-mbl-float-none" style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;"><div>Keep exploring around and let us know if you need any help. We can be approached via following ways.</div>
    
    <div><span style="background-color: transparent;">Call us - +${details.account.countryCode}-${details.account.phone}</span></div>
    
    <div><span style="background-color: transparent;">Email us - ${details.account.email} </span></div>
    </td>
                                                    </tr>
                                                    </tbody></table>
                                                </th>
    
                                            </tr></tbody></table></td>
                            </tr>
                        </tbody></table>
    
                    </td>
                </tr>
            </tbody></table>
            <!--[if mso 15]>
                </td>
                <![endif]-->
    
                <!--[if mso 15]>
                </tr>
                </table>
                <![endif]-->
            
        </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
                
                <!--[if mso]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->
                
                <!--[if mso]>
                <td valign="top" width="590" style="width:590px;">
                <![endif]-->
                <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                <tbody><tr>
                    <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="mso-button-block rnb-container" style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                            <tbody><tr>
                                <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td valign="top" class="rnb-container-padding" align="left">
    
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                        <tbody><tr>
                                            <th class="rnb-force-col" valign="top">
    
                                                <table border="0" valign="top" cellspacing="0" cellpadding="0" width="550" align="center" class="rnb-col-1">
    
                                                    <tbody><tr>
                                                        <td valign="top">
                                                            <table cellpadding="0" border="0" align="center" cellspacing="0" class="rnb-btn-col-content" style="margin:auto; border-collapse: separate;">
                                                                <tbody><tr>
                                                                    <td width="auto" valign="middle" bgcolor="#f56b58" align="center" height="40" style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                        <span style="color:#ffffff; font-weight:normal;">
                                                                                <a style="text-decoration:none; color:#ffffff; font-weight:normal;" target="_blank">Happy Learning !!!</a>
                                                                            </span>
                                                                    </td>
                                                                </tr></tbody></table>
                                                        </td>
                                                    </tr>
                                                    </tbody></table>
                                                </th>
                                        </tr>
                                    </tbody></table></td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                            </tr>
                        </tbody></table>
    
                    </td>
                </tr>
            </tbody></table>
            <!--[if mso]>
                </td>
                <![endif]-->
                
                <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
                
            </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(249, 250, 252);">
                
                <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                    <tbody><tr>
                        <td class="rnb-del-min-width" align="center" valign="top" bgcolor="#f9fafc" style="min-width: 590px; background-color: rgb(249, 250, 252);">
                            <table width="590" class="rnb-container" cellpadding="0" border="0" align="center" cellspacing="0">
                                <tbody><tr>
                                    <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td valign="top" class="rnb-container-padding" style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;" align="left">
    
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="rnb-columns-container">
                                            <tbody><tr>
                                                <th class="rnb-force-col" style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;" valign="top">
    
                                                    <table border="0" valign="top" cellspacing="0" cellpadding="0" width="264" align="left" class="rnb-col-2 rnb-social-text-left" style="border-bottom:0;">
    
                                                        <tbody><tr>
                                                            <td valign="top">
                                                                <table cellpadding="0" border="0" align="left" cellspacing="0" class="rnb-btn-col-content">
                                                                    <tbody><tr>
                                                                        <td valign="middle" align="left" style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px" class="rnb-text-center">
                                                                        <div>
                                                                            <div>platform.example.com&nbsp;</div>
                                                                            <div>340 S Lemon Ave,</div>
                                                                            <div>#9894 Walnut,</div>
                                                                            <div>Ca 91789</div>
                                                                        </div>
                                                                        </td></tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                        </tbody></table>
                                                    </th><th ng-if="item.text.align=='left'" class="rnb-force-col rnb-social-width" valign="top" style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">
    
                                                    <table border="0" valign="top" cellspacing="0" cellpadding="0" width="246" align="right" class="rnb-last-col-2">
    
                                                        <tbody><tr>
                                                            <td valign="top">
                                                                <table cellpadding="0" border="0" cellspacing="0" class="rnb-social-align" style="float: right;" align="right">
                                                                    <tbody><tr>
                                                                        <td valign="middle" class="rnb-text-center" ng-init="width=setSocialIconsBlockWidth(item)" width="125" align="right">
                                                                            <div class="rnb-social-center">
                                                                            <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                            <tbody><tr>
                                                                                    <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                            <span style="color:#ffffff; font-weight:normal;">
                                                                                <a target="_blank" href="https://www.facebook.com/Utobians"><img alt="Facebook" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a></span>
                                                                            </td></tr></tbody></table>
                                                                            </div><div class="rnb-social-center">
                                                                            <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                            <tbody><tr>
                                                                                    <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                            <span style="color:#ffffff; font-weight:normal;">
                                                                                <a target="_blank" href="https://www.linkedin.com/company/company/"><img alt="Twitter" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a></span>
                                                                            </td></tr></tbody></table>
                                                                            </div><div class="rnb-social-center">
                                                                            <table align="left" style="float:left; display: inline-block" border="0" cellpadding="0" cellspacing="0">
                                                                            <tbody><tr>
                                                                                    <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;" align="left">
                                                                            <span style="color:#ffffff; font-weight:normal;">
                                                                                <a target="_blank" href="https://www.linkedin.com/company/edtech-platform"><img alt="LinkedIn" border="0" hspace="0" vspace="0" style="vertical-align:top;" target="_blank" src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a></span>
                                                                            </td></tr></tbody></table>
                                                                            </div></td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                        </tbody></table>
                                                    </th></tr>
                                        </tbody></table></td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                </tr>
                            </tbody></table>
    
                        </td>
                    </tr></tbody></table>
                
            </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <div style="background-color: rgb(249, 250, 252);">
                
                <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_4" id="Layout_4">
                    <tbody><tr>
                        <td class="rnb-del-min-width" align="center" valign="top" style="min-width:590px;">
                            <table width="100%" cellpadding="0" border="0" align="center" cellspacing="0" bgcolor="#f9fafc" style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                <tbody><tr>
                                    <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                        <div>©2021 Company Inc.</div>
                                    </td></tr>
                                <tr>
                                    <td height="20" style="font-size:1px; line-height:0px; mso-hide: all;">&nbsp;</td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>
                
            </div></td>
    </tr><tr>
    
        <td align="center" valign="top">
    
            <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0" cellspacing="0" style="min-width:590px;" name="Layout_3971" id="Layout_3971">
                <tbody><tr>
                    <td class="rnb-del-min-width" valign="top" align="center" style="min-width:590px;">
                        <table width="100%" cellpadding="0" border="0" height="38" cellspacing="0">
                            <tbody><tr>
                                <td valign="top" height="38">
                                    <img width="20" height="38" style="display:block; max-height:38px; max-width:20px;" alt="" src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            </td>
    </tr></tbody></table>
            <!--[if gte mso 9]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                        </td>
        </tr>
        </tbody></table>
    
        </body></html>`;

        var template = handlebars.compile(htmlContent);
        var replacements = {
            logo: details.account.image ? details.account.image : 'https://img.mailinblue.com/2598720/images/rnb/original/5e47eadb9967ccbc76710418.png'
        };
        var htmlToSend = template(replacements);

        [err, info] = await to(module.exports.SendMailUsingTOA(name, user.email, subject, htmlToSend));


    }
}

// Send Text Message
module.exports.SendTextMessage = async function (phoneNumber, textMessage) {

    var params = {
        Message: textMessage,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': '[PLATFORM]'
            },
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': 'Transactional'
            },
        }
    };

    let snsObj = new aws.SNS({ apiVersion: '2010-03-31' });
    [err, response] = await to(snsObj.publish(params).promise());
    if (err) this.TE(err.message);
    return response;
}

// Create SNS Topic
module.exports.CreateSNSTopic = async function (topicName) {

    var params = { Name: topicName };

    let snsObj = new aws.SNS({ apiVersion: '2010-03-31' });
    [err, response] = await to(snsObj.createTopic(params).promise());
    if (err) this.TE(err.message);
    return response;
}

// Add Subscriber to Topic
module.exports.AddSubscriberToSNSTopic = async function (topicARN, phoneNumber) {

    var params = {
        Protocol: 'SMS',
        TopicArn: topicARN,
        Endpoint: phoneNumber
    };

    let snsObj = new aws.SNS({ apiVersion: '2010-03-31' });
    [err, response] = await to(snsObj.subscribe(params).promise());
    if (err) this.TE(err.message);
    return response;
}

// Send Text message to Topic
module.exports.SendSMSToSNSTopic = async function (topicARN, textMessage) {

    var params = {
        Message: textMessage,
        TopicArn: topicARN,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': '[PLATFORM]'
            },
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': 'Transactional'
            },
        }
    };

    let snsObj = new aws.SNS({ apiVersion: '2010-03-31' });
    [err, response] = await to(snsObj.publish(params).promise());
    if (err) this.TE(err.message);
    return response;
}



/* 
    Upload Email Attachments and more File in the File Name Folder
*/
module.exports.UploadEmailFiles = async function (accountId, imageName, fileBuffer) {

    var imageName = imageName.replace(/\s+/g, "_");
    const fileKey = accountId + '/emailAttachments/' + imageName;

    const params = {
        Bucket: CONFIG.emailAttatchmentsbucket,
        Key: fileKey,
        Body: fileBuffer,
        CacheControl: "max-age=31556926 , public"
    };

    [err, res] = await to(s3.upload(params).promise());
    if (err) this.TE(err.message);

    return res;
};
