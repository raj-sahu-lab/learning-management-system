const dashboardService = require('../../../services/V1/WebSite/Dashboard.service');
const authServiceInstitute = require('../../../services/V1/Institute/auth.service');
const purchaseStudentService = require('../../../services/V1/Student/Purchase.service');
const moment = require('moment');
const { to, ReE, ReS, GetSignUrl, SendContentPurchaseEmail } = require('../../../services/V1/util.service');
const Stripe = require('stripe');

// Home screen
module.exports.dashBordDetail = async function (req, res) {

    var account;
    if (req.isAuthenticated()) {

        account = req.user;

    } else {

        let domain = req.headers.domain;
        [err, account] = await to(dashboardService.getRequestedAccount(domain));
    }

    if (account) {

        var accountJSON;
        if (req.isAuthenticated()) { accountJSON = account; } else { accountJSON = account.toWeb(); }


        [err, plan] = await to(authServiceInstitute.checkPlan(accountJSON.id));
        if (err) return ReE(res, err, 422);

        if (plan) {

            let planEndDate = new Date(plan.plan_edate);
            let currentDate = new Date();

            if (currentDate > planEndDate) {

                return ReE(res, 'Request Account Expired.', 422);

            } else {

                accountJSON.image = await GetSignUrl(accountJSON.image);
                if (!req.isAuthenticated()) {
                    accountJSON.bearer_token = account.getJWTWebsite(null);
                } else {

                    delete accountJSON.currentPlan;
                    delete accountJSON.delete;

                }

                var courseSinged = [];

                [err, courseList] = await to(dashboardService.getCoursesList(accountJSON.id));

                if (courseList && courseList.length > 0) {

                    await Promise.all(courseList.map(async (course) => {

                        var courseJson = course.toJSON();
                        courseJson.image = await GetSignUrl(courseJson.image);
                        if (courseJson.tutor.image) {

                            courseJson.tutor.image = await GetSignUrl(courseJson.tutor.image);
                        }

                        if (account.student) {

                            [err, purchase] = await to(dashboardService.checkPurchase(1, courseJson.id, account.student.id));
                            if (purchase) {
                                let purchaseJSON = purchase.toJSON();
                                let purchaseDate = new Date(purchaseJSON.purchaseDate);
                                purchaseDate.setTime(purchaseDate.getTime() + purchaseJSON.dayLimit * 86400000);
                                const currentDate = new Date();

                                if (purchaseDate > currentDate) {

                                    const miliSecound = purchaseDate.getTime() - currentDate.getTime()
                                    var remainHours = (miliSecound / (1000 * 60 * 60)).toFixed(2);
                                    purchaseJSON.remainHours = parseFloat(remainHours);
                                    purchaseJSON.remainDays = purchaseJSON.dayLimit - purchaseJSON.remainDays;
                                    courseJson.purchase = purchaseJSON;

                                } else {

                                    courseJson.purchase = null;
                                }
                            } else {

                                courseJson.purchase = null;
                            }
                        }
                        courseSinged.push(courseJson)

                    }));
                }

                if (account.student) { delete account.student; }
                const response = { account: accountJSON, course: courseSinged }
                return ReS(res, 'List Got Successfully.', response);
            }

        } else {

            return ReE(res, 'Request Account Expired.', 402);
        }

    } else {
        return ReE(res, 'Request Account not found.', 422);
    }
}

module.exports.verifyCouponcode = async function (req, res) {

    const body = req.fields;

    if (!body.accountId) {

        return ReE(res, 'Please select institute.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.couponCode) {

        return ReE(res, 'Please enter coupon code.', 422);

    } else {

        [err, couponObj] = await to(purchaseStudentService.getCoupon(body.accountId, body.subjectId, body.couponCode));
        if (err) return ReE(res, err, 422);
        if (couponObj) {

            let coupon = couponObj.toJSON();
            [err, totalUser] = await to(purchaseStudentService.getCouponUsedUserCount(coupon.id));

            if (err) {
                return ReE(res, 'Invalid coupon code', 422);
            }
            if (totalUser == null) {
                return ReE(res, 'Invalid coupon code', 422);
            }

            const startDate = moment(coupon.startDate, "YYYY-MM-DD");
            const endDate = moment(coupon.endDate, "YYYY-MM-DD");
            const currentDate = moment();

            if (currentDate.isBetween(startDate, endDate)) {

                if (totalUser < coupon.maxUsers) {

                    delete coupon.maxUsers;
                    return ReS(res, 'Valid Coupon code.', coupon);

                } else {
                    return ReE(res, 'Coupon expired', 422);
                }
            } else {
                return ReE(res, 'Coupon expired', 422);
            }

        } else {
            return ReE(res, 'Invalid coupon code', 422);
        }
    }

}

module.exports.addPurchase = async function (req, res) {

    if (req.user.student) {

        const body = req.fields;

        if (!body.accountId) {

            return ReE(res, 'Please select institute.', 422);

        } else if (!body.type) {

            return ReE(res, 'Please enter purchase type.', 422);

        } else if (!body.id) {

            return ReE(res, 'Please enter id.', 422);

        } else if (!body.paymentGateWayId) {

            return ReE(res, 'Please enter payment gate way id.', 422);

        } else if (!body.transactionId) {

            return ReE(res, 'Please enter transaction id.', 422);

        } else if (!body.amount) {

            return ReE(res, 'Please enter amount.', 422);

        } else if (!body.purchaseResponse) {

            return ReE(res, 'Please enter purchase response.', 422);

        } else {

            var dayLimit = 0;
            var details;
            if (body.type == 1) {

                [err, subject] = await to(purchaseStudentService.getSubject(body.id));
                if (err) return ReE(res, err, 422);
                if (!subject)
                    return ReE(res, 'Subject not found.', 422);

                dayLimit = subject.toJSON().validity;
                details = subject.toJSON();

            } else if (body.type == 2) {

                [err, topic] = await to(purchaseStudentService.getTopic(body.id));
                if (err) return ReE(res, err, 422);
                if (!topic)
                    return ReE(res, 'Topic not found.', 422);
                dayLimit = topic.toJSON().validity;
                details = topic.toJSON();

            } else if (body.type == 3) {

                [err, content] = await to(purchaseStudentService.getContent(body.id));
                if (err) return ReE(res, err, 422);
                if (!content)
                    return ReE(res, 'Content not found.', 422);
                dayLimit = content.toJSON().validity;
                details = content.toJSON();

            } else if (body.type == 6) {

                [err, pdf] = await to(purchaseStudentService.getPDF(body.id));
                if (err) return ReE(res, err, 422);
                if (!pdf)
                    return ReE(res, 'Pdf not found.', 422);
                dayLimit = pdf.toJSON().validity;
                details = pdf.toJSON();

            } else if (body.type == 7) {

                [err, ppt] = await to(purchaseStudentService.getPPT(body.id));
                if (err) return ReE(res, err, 422);
                if (!ppt)
                    return ReE(res, 'PPT not found.', 422);
                dayLimit = ppt.toJSON().validity;
                details = ppt.toJSON();

            } else if (body.type == 8) {

                [err, audio] = await to(purchaseStudentService.getAudio(body.id));
                if (err) return ReE(res, err, 422);
                if (!audio)
                    return ReE(res, 'Audio not found.', 422);
                dayLimit = audio.toJSON().validity;
                details = audio.toJSON();

            } else if (body.type == 9) {

                [err, video] = await to(purchaseStudentService.getVideo(body.id));
                if (err) return ReE(res, err, 422);
                if (!video)
                    return ReE(res, 'Video not found.', 422);
                dayLimit = video.toJSON().validity;
                details = video.toJSON();
            }

            const purchaseJson = {

                student_id: req.user.student.id,
                account_id: body.accountId,
                type: body.type,
                typeId: body.id,
                dayLimit: dayLimit,
                create_ip: req.ip,
            };

            [err, purchase] = await to(purchaseStudentService.addPurchase(purchaseJson));
            if (err) return ReE(res, err, 422);


            var purchaseDetailJson = {

                purchase_id: purchase.toJSON().id,
                transaction_id: body.transactionId,
                gateway_id: body.paymentGateWayId,
                payment_response: body.purchaseResponse,
                amount: body.amount,
                create_ip: req.ip,
            };

            if(body.currencyId){
                purchaseDetailJson.currencyId = body.currencyId;
            }


            if (body.offer && (body.offer.offerId != null) && (body.offer.code != null) && (body.offer.discountAmount != null)) {

                purchaseDetailJson.offer_id = body.offer.offerId;
                purchaseDetailJson.offer_code = body.offer.code;
                purchaseDetailJson.offer_discount = body.offer.discountAmount;
            }

            [err, purchaseDetail] = await to(purchaseStudentService.addPurchaseDetail(purchaseDetailJson));
            if (err) return ReE(res, err, 422);


            [err, purchase] = await to(purchaseStudentService.getPurchase(req.user.student.id, purchase.toJSON().id));
            if (err) return ReE(res, err, 422);

            let purchasedJson = purchase.toJSON();

            if (details) {

                details.account.image = await GetSignUrl(details.account.image);
                purchasedJson.detail = details;
                await to(SendContentPurchaseEmail(req.user, details));
            }

            return ReS(res, 'Product purchased successfully.', purchasedJson);
        }
    } else {
        return ReE(res, 'Please login first.', 422);
    }
}

module.exports.addStripePurchase = async function (req, res) {

    if (req.user.student) {
        const body = req.fields;

        if (!body.accountId) {

            return ReE(res, 'Please select institute.', 422);

        } else if (!body.type) {

            return ReE(res, 'Please enter purchase type.', 422);

        } else if (!body.id) {

            return ReE(res, 'Please enter id.', 422);

        } else if (!body.paymentGateWayId) {

            return ReE(res, 'Please enter payment gate way id.', 422);

        } else if (!body.amount) {

            return ReE(res, 'Please enter amount.', 422);

        } else if (!body.beforeDiscount) {

            return ReE(res, 'Please enter amount.', 422);

        } else if (!body.currency) {

            return ReE(res, 'Please enter currency.', 422);

        } else if (!body.stripeToken) {

            return ReE(res, 'No token present', 422);

        } else {

            [err, stripe] = await to(purchaseStudentService.getStripeKey(body.accountId))
            if(err){
                return ReE(res, err, 422);
            }

            if(!stripe){
                return ReE(res, 'No key found', 422);
            }

            let jsonStripe = stripe.toJSON();
            const stripeInit = Stripe(jsonStripe.secret);
            stripeInit.charges.create({
                amount: body.amount * 100,
                currency: body.currency,
                source: body.stripeToken, // token from stripe
                description: "online buy"
            }, async (err, charge)=>{
                if(err){
                    return ReE(res, err, 422);
                }

                var dayLimit = 0;
                var details;
                if (body.type == 1) {

                    [err, subject] = await to(purchaseStudentService.getSubject(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!subject)
                        return ReE(res, 'Subject not found.', 422);

                    dayLimit = subject.toJSON().validity;
                    details = subject.toJSON();

                } else if (body.type == 2) {

                    [err, topic] = await to(purchaseStudentService.getTopic(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!topic)
                        return ReE(res, 'Topic not found.', 422);
                    dayLimit = topic.toJSON().validity;
                    details = topic.toJSON();

                } else if (body.type == 3) {

                    [err, content] = await to(purchaseStudentService.getContent(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!content)
                        return ReE(res, 'Content not found.', 422);
                    dayLimit = content.toJSON().validity;
                    details = content.toJSON();

                } else if (body.type == 6) {

                    [err, pdf] = await to(purchaseStudentService.getPDF(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!pdf)
                        return ReE(res, 'Pdf not found.', 422);
                    dayLimit = pdf.toJSON().validity;
                    details = pdf.toJSON();

                } else if (body.type == 7) {

                    [err, ppt] = await to(purchaseStudentService.getPPT(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!ppt)
                        return ReE(res, 'PPT not found.', 422);
                    dayLimit = ppt.toJSON().validity;
                    details = ppt.toJSON();

                } else if (body.type == 8) {

                    [err, audio] = await to(purchaseStudentService.getAudio(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!audio)
                        return ReE(res, 'Audio not found.', 422);
                    dayLimit = audio.toJSON().validity;
                    details = audio.toJSON();

                } else if (body.type == 9) {

                    [err, video] = await to(purchaseStudentService.getVideo(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!video)
                        return ReE(res, 'Video not found.', 422);
                    dayLimit = video.toJSON().validity;
                    details = video.toJSON();

                } else if (body.type == 10) {

                    [err, bundle] = await to(purchaseStudentService.getTestBundle(body.id));
                    if (err) return ReE(res, err, 422);
                    if (!bundle)
                        return ReE(res, 'Test bundle not found.', 422);
                    dayLimit = bundle.toJSON().validity;
                    details = bundle.toJSON();
                }

                const purchaseJson = {

                    student_id: req.user.student.id,
                    account_id: body.accountId,
                    type: body.type,
                    typeId: body.id,
                    dayLimit: dayLimit,
                    create_ip: req.ip,
                };

                [err, purchase] = await to(purchaseStudentService.addPurchase(purchaseJson));
                if (err) return ReE(res, err, 422);

                var purchaseDetailJson = {

                    purchase_id: purchase.toJSON().id,
                    transaction_id: charge.id,
                    payment_response: JSON.stringify(charge),
                    amount: body.beforeDiscount,
                    create_ip: req.ip,
                };

                if(body.currencyId){
                    purchaseDetailJson.currencyId = body.currencyId;
                }

                if (body.offer && (body.offer.offerId != null) && (body.offer.code != null) && (body.offer.discountAmount != null)) {

                    purchaseDetailJson.offer_id = body.offer.offerId;
                    purchaseDetailJson.offer_code = body.offer.code;
                    purchaseDetailJson.offer_discount = body.offer.discountAmount;
                }
                
                if (req.headers.devicetype == 2) {

                    purchaseDetailJson.iosPaymentGateWayid = body.paymentGateWayId;

                } else {

                    purchaseDetailJson.gateway_id = body.paymentGateWayId;
                }

                [err, purchaseDetail] = await to(purchaseStudentService.addPurchaseDetail(purchaseDetailJson));
                if (err) return ReE(res, err, 422);


                [err, purchase] = await to(purchaseStudentService.getPurchase(req.user.student.id, purchase.toJSON().id));
                if (err) return ReE(res, err, 422);

                let purchasedJson = purchase.toJSON();

                if (details) {

                    details.account.image = await GetSignUrl(details.account.image);
                    purchasedJson.detail = details;
                    await to(SendContentPurchaseEmail(req.user, details));
                }

                return ReS(res, 'Product purchased successfully.', purchasedJson);
            });

        }
    } else {
        return ReE(res, 'Request Account not found.', 422);
    }
    
}

module.exports.getAccountDetailAndBranches = async function (req, res) {

    const account = req.user;
    if (account) {

        [err, accountDetail] = await to(dashboardService.getAccountDetailAndBranches(account.account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Contact detail get successfully.', accountDetail);

    } else {

        return ReE(res, 'Account not found', 422);
    }

}

module.exports.getPrivacyPolicy = async function (req, res) {

    const account = req.user;
    if (account) {
        [err, privacyPolicy] = await to(dashboardService.getPrivacyPolicy(account.account_id));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Privacy policy get successfully.', privacyPolicy);
    } else {

        return ReE(res, 'Account not found', 422);
    }
}