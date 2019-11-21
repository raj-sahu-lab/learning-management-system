const cron = require("node-cron");
const moment = require('moment');
const cronJobService = require('../../services/V1/CronJob.service');
const { to, ReS, ReE, SendMailUsingTOA } = require("../../services/V1/util.service");
const fs = require("fs");

// module.exports.getAL = async function(req, res) {

//     [err, allAccountList] = await to(cronJobService.getActiveAccounts());
//     for (let index = 0; index < allAccountList.length; index++) {
    
//         const account = allAccountList[index].toJSON();
        
//         if (account.purchaseList.length > 0 && (account.razerPaySubscriptionId === null || account.razerPaySubscriptionId === '')) {
    
//             const lastPurchase = account.purchaseList[account.purchaseList.length - 1];
    
//             const endDate = moment(lastPurchase.plan_edate, "YYYY-MM-DD");
            
//             const currentDate = moment();
    
//             const remainDays = endDate.diff(currentDate, 'days')
//             if (remainDays < -30){
//                 console.log(remainDays + " = " +account.account_id + " -> " + account.account_title);
//                 // console.log(remainDays);
//             }
            
    
//             // console.log('==============' + account.account_title + '====================');
//             // console.log(remainDays);
//             // console.log('===================================');
//         }
//     }
// }

cron.schedule("* * * 07 * *", async function() {
    
    
    [err, allAccountList] = await to(cronJobService.getActiveAccounts());
    for (let index = 0; index < allAccountList.length; index++) {

        const account = allAccountList[index].toJSON();
        
        if (account.purchaseList.length > 0 && (account.razerPaySubscriptionId === null || account.razerPaySubscriptionId === '')) {

            const lastPurchase = account.purchaseList[account.purchaseList.length - 1];

            const endDate = moment(lastPurchase.plan_edate, "YYYY-MM-DD");
            
            const currentDate = moment();

            const remainDays = endDate.diff(currentDate, 'days')

            if (remainDays == 6) {

                fs.readFile(__dirname + '/../../views/email/7days.html', 'utf8',async function (err, htmlContent) {

                    if (htmlContent) {
    
                        [err, info] = await to(SendMailUsingTOA(account.account_title, account.account_email, 'Renew your subscription', htmlContent));
                    }
                });

            } else if (remainDays == 1) {

                fs.readFile(__dirname + '/../../views/email/2days.html', 'utf8',async function (err, htmlContent) {

                    if (htmlContent) {
    
                        [err, info] = await to(SendMailUsingTOA(account.account_title, account.account_email, 'Renew your subscription', htmlContent));
                    }
                });

            } else if (remainDays == 0) {

                fs.readFile(__dirname + '/../../views/email/0day.html', 'utf8',async function (err, htmlContent) {
                    if (htmlContent) {
    
                        var replacementHtml = htmlContent;
                        replacementHtml = replacementHtml.replace('[First Name]', account.account_title);
                        [err, info] = await to(SendMailUsingTOA(account.account_title, account.account_email, 'Renew your subscription', replacementHtml));
                    }
                });

            } else if(remainDays == -1 && lastPurchase.plan_id == 7){

                fs.readFile(__dirname + '/../../views/email/freetrialend.html', 'utf8',async function (err, htmlContent) {
                    if (htmlContent) {
    
                        var replacementHtml = htmlContent;
                        [err, info] = await to(SendMailUsingTOA(account.account_title, account.account_email, 'Renew your subscription', replacementHtml));
                    }
                });

            } else if (remainDays == -9) {

                fs.readFile(__dirname + '/../../views/email/contentdelete.html', 'utf8',async function (err, htmlContent) {

                    if (htmlContent) {
    
                        var replacementHtml = htmlContent;
                        replacementHtml = replacementHtml.replace('[First Name]', account.account_title);
                        [err, info] = await to(SendMailUsingTOA(account.account_title, account.account_email, 'Renew your subscription', replacementHtml));
                    }
                });

            }

            // console.log('==============' + account.account_title + '====================');
            // console.log(remainDays);
            // console.log('===================================');
        }
    }


});