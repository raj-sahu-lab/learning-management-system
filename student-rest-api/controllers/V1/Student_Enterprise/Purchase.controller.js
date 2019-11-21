const purchaseService = require('../../../services/V1/Student_Enterprise/Purchase.service');
const { to, ReE, ReS, GetSignUrl, SendContentPurchaseEmail } = require('../../../services/V1/util.service');
const moment = require('moment');
const Stripe = require('stripe');

module.exports.verifyCouponcode = async function (req, res) {

    const body = req.fields;

    if (!body.accountId) {

        return ReE(res, 'Please select institute.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.couponCode) {

        return ReE(res, 'Please enter coupon code.', 422);

    } else {

        [err, couponObj] = await to(purchaseService.getCoupon(body.accountId, body.subjectId, body.couponCode));
        if (err) return ReE(res, err, 422);
        if (couponObj) {

            let coupon = couponObj.toJSON();
            [err, totalUser] = await to(purchaseService.getCouponUsedUserCount(coupon.id));

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

            [err, subject] = await to(purchaseService.getSubject(body.id));
            if (err) return ReE(res, err, 422);
            if (!subject)
                return ReE(res, 'Subject not found.', 422);

            dayLimit = subject.toJSON().validity;
            details = subject.toJSON();

        } else if (body.type == 2) {

            [err, topic] = await to(purchaseService.getTopic(body.id));
            if (err) return ReE(res, err, 422);
            if (!topic)
                return ReE(res, 'Topic not found.', 422);
            dayLimit = topic.toJSON().validity;
            details = topic.toJSON();

        } else if (body.type == 3) {

            [err, content] = await to(purchaseService.getContent(body.id));
            if (err) return ReE(res, err, 422);
            if (!content)
                return ReE(res, 'Content not found.', 422);
            dayLimit = content.toJSON().validity;
            details = content.toJSON();

        } else if (body.type == 6) {

            [err, pdf] = await to(purchaseService.getPDF(body.id));
            if (err) return ReE(res, err, 422);
            if (!pdf)
                return ReE(res, 'Pdf not found.', 422);
            dayLimit = pdf.toJSON().validity;
            details = pdf.toJSON();

        } else if (body.type == 7) {

            [err, ppt] = await to(purchaseService.getPPT(body.id));
            if (err) return ReE(res, err, 422);
            if (!ppt)
                return ReE(res, 'PPT not found.', 422);
            dayLimit = ppt.toJSON().validity;
            details = ppt.toJSON();

        } else if (body.type == 8) {

            [err, audio] = await to(purchaseService.getAudio(body.id));
            if (err) return ReE(res, err, 422);
            if (!audio)
                return ReE(res, 'Audio not found.', 422);
            dayLimit = audio.toJSON().validity;
            details = audio.toJSON();

        } else if (body.type == 9) {

            [err, video] = await to(purchaseService.getVideo(body.id));
            if (err) return ReE(res, err, 422);
            if (!video)
                return ReE(res, 'Video not found.', 422);
            dayLimit = video.toJSON().validity;
            details = video.toJSON();

        } else if (body.type == 10) {

            [err, bundle] = await to(purchaseService.getTestBundle(body.id));
            if (err) return ReE(res, err, 422);
            if (!bundle)
                return ReE(res, 'Test bundle not found.', 422);
            dayLimit = bundle.toJSON().validity;
            details = bundle.toJSON();
        }

        const purchaseJson = {

            student_id: req.user.id,
            account_id: body.accountId,
            type: body.type,
            typeId: body.id,
            dayLimit: dayLimit,
            create_ip: req.ip,
        };



        [err, purchase] = await to(purchaseService.addPurchase(purchaseJson));
        if (err) return ReE(res, err, 422);


        var purchaseDetailJson = {

            purchase_id: purchase.toJSON().id,
            transaction_id: body.transactionId,
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
        
        if (req.headers.devicetype == 2) {

            purchaseDetailJson.iosPaymentGateWayid = body.paymentGateWayId;

        } else {

            purchaseDetailJson.gateway_id = body.paymentGateWayId;
        }


        [err, purchaseDetail] = await to(purchaseService.addPurchaseDetail(purchaseDetailJson));
        if (err) return ReE(res, err, 422);


        [err, purchase] = await to(purchaseService.getPurchase(req.user.id, purchase.toJSON().id));
        if (err) return ReE(res, err, 422);

        let purchasedJson = purchase.toJSON();

        if (details) {

            details.account.image = await GetSignUrl(details.account.image);
            purchasedJson.detail = details;
            await to(SendContentPurchaseEmail(req.user, details));
        }

        return ReS(res, 'Product purchased successfully.', purchasedJson);
    }
}

module.exports.addStripePurchase = async function (req, res) {

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

        [err, stripe] = await to(purchaseService.getStripeKey(body.accountId))
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

                [err, subject] = await to(purchaseService.getSubject(body.id));
                if (err) return ReE(res, err, 422);
                if (!subject)
                    return ReE(res, 'Subject not found.', 422);

                dayLimit = subject.toJSON().validity;
                details = subject.toJSON();

            } else if (body.type == 2) {

                [err, topic] = await to(purchaseService.getTopic(body.id));
                if (err) return ReE(res, err, 422);
                if (!topic)
                    return ReE(res, 'Topic not found.', 422);
                dayLimit = topic.toJSON().validity;
                details = topic.toJSON();

            } else if (body.type == 3) {

                [err, content] = await to(purchaseService.getContent(body.id));
                if (err) return ReE(res, err, 422);
                if (!content)
                    return ReE(res, 'Content not found.', 422);
                dayLimit = content.toJSON().validity;
                details = content.toJSON();

            } else if (body.type == 6) {

                [err, pdf] = await to(purchaseService.getPDF(body.id));
                if (err) return ReE(res, err, 422);
                if (!pdf)
                    return ReE(res, 'Pdf not found.', 422);
                dayLimit = pdf.toJSON().validity;
                details = pdf.toJSON();

            } else if (body.type == 7) {

                [err, ppt] = await to(purchaseService.getPPT(body.id));
                if (err) return ReE(res, err, 422);
                if (!ppt)
                    return ReE(res, 'PPT not found.', 422);
                dayLimit = ppt.toJSON().validity;
                details = ppt.toJSON();

            } else if (body.type == 8) {

                [err, audio] = await to(purchaseService.getAudio(body.id));
                if (err) return ReE(res, err, 422);
                if (!audio)
                    return ReE(res, 'Audio not found.', 422);
                dayLimit = audio.toJSON().validity;
                details = audio.toJSON();

            } else if (body.type == 9) {

                [err, video] = await to(purchaseService.getVideo(body.id));
                if (err) return ReE(res, err, 422);
                if (!video)
                    return ReE(res, 'Video not found.', 422);
                dayLimit = video.toJSON().validity;
                details = video.toJSON();

            } else if (body.type == 10) {

                [err, bundle] = await to(purchaseService.getTestBundle(body.id));
                if (err) return ReE(res, err, 422);
                if (!bundle)
                    return ReE(res, 'Test bundle not found.', 422);
                dayLimit = bundle.toJSON().validity;
                details = bundle.toJSON();
            }

            const purchaseJson = {

                student_id: req.user.id,
                account_id: body.accountId,
                type: body.type,
                typeId: body.id,
                dayLimit: dayLimit,
                create_ip: req.ip,
            };

            [err, purchase] = await to(purchaseService.addPurchase(purchaseJson));
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

            [err, purchaseDetail] = await to(purchaseService.addPurchaseDetail(purchaseDetailJson));
            if (err) return ReE(res, err, 422);


            [err, purchase] = await to(purchaseService.getPurchase(req.user.id, purchase.toJSON().id));
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
}

module.exports.purchaseList = async function (req, res) {

    [err, purchaseList] = await to(purchaseService.purchaseList(req.user.id));
    if (err) return ReE(res, err, 422);

    if (purchaseList.length == 0) {

        return ReS(res, 'Purchase List empty.', [], 204);

    } else {

        var purchasedSinged = []

        await Promise.all(purchaseList.map(async (purchase) => {

            let purchasedJson = purchase.toJSON();



            var details;
            if (purchasedJson.type == 1) {

                [err, subject] = await to(purchaseService.getSubject(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);

                if (subject)
                    details = subject.toJSON();

            } else if (purchasedJson.type == 2) {

                [err, topic] = await to(purchaseService.getTopic(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (topic)
                    details = topic.toJSON();

            } else if (purchasedJson.type == 3) {

                [err, content] = await to(purchaseService.getContent(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (content)
                    details = content.toJSON();

            } else if (purchasedJson.type == 6) {

                [err, pdf] = await to(purchaseService.getPDF(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (pdf)
                    details = pdf.toJSON();

            } else if (purchasedJson.type == 7) {

                [err, ppt] = await to(purchaseService.getPPT(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (ppt)
                    details = ppt.toJSON();

            } else if (purchasedJson.type == 8) {

                [err, audio] = await to(purchaseService.getAudio(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (audio)
                    details = audio.toJSON();

            } else if (purchasedJson.type == 9) {

                [err, video] = await to(purchaseService.getVideo(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (video)
                    details = video.toJSON();

            } else if (purchasedJson.type == 10) {

                [err, bundle] = await to(purchaseService.getTestBundle(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (bundle)
                    details = bundle.toJSON();
            }

            if (details) {

                details.account.image = await GetSignUrl(details.account.image);
                purchasedJson.detail = details;
            }
            purchasedSinged.push(purchasedJson)

        }));

        return ReS(res, 'Purchase list get successfully.', purchasedSinged);
    }
}

module.exports.generaeRazorPayKey = async function (req, res) {

    const body = req.fields;

    if (!body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (!body.amount) {

        return ReE(res, 'Please enter valid amount.', 422);

    } else {
        var options = {
            amount: 50000,  // amount in the smallest currency unit  
            currency: "INR",
            receipt: "order_rcptid_11",
            payment_capture: '0'
        };
        instance.orders.create(options, function (err, order) {

            console.log(order);
        });
    }
}