const { TOA_account, TOA_branch, TOA_student, TOA_subject, TOA_topic, TOA_content, TOA_pdf, TOA_ppt, TOA_audio, TOA_video, TOA_practice, TOA_test, TOA_testbundle_Bundle, TOA_student_purchase, TOA_student_purchase_detail, TOA_currency, TOA_tutor } = require('../../../models');
const { to, TE, ReE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

// Get All Branch List
const getFilterDataByDate = async function (accountId) {

    // 1- Subject , 2 - Topic , 3 - Content , 4 - Test , 5 - Practice , 6 - PDF , 7 - PPT , 8 - Audio , 9 - Video , 10 - Test Bundle

    [err, subjectCount] = await to(TOA_subject.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, topicCount] = await to(TOA_topic.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, contentCount] = await to(TOA_content.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, pdfCount] = await to(TOA_pdf.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, pptCount] = await to(TOA_ppt.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, audioCount] = await to(TOA_audio.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, videoCount] = await to(TOA_video.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, practiceCount] = await to(TOA_practice.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, testCount] = await to(TOA_test.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, bundleCount] = await to(TOA_testbundle_Bundle.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    [err, studentListToday] = await to(TOA_account.findOne({ 
        where: { account_id: accountId, status: 0, delete: 0 },
        attributes: ['account_id'],
        include : [{
            model: TOA_branch,
            as: 'branches',
            where: { status :0, delete: 0 },
            attributes: ['branch_id', 'branch_name'],
            required: false,
            include: [{
                model : TOA_student,
                as : 'students',
                where: { 
                    status : 0,
                    delete: 0,
                    createdAt : {
                        [Op.gte]: moment().format('YYYY-MM-DD'),
                        [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD')
                    }
                },
                attributes: ['id'],
                required: false
            }]
        }]
    }));

    [err, studentListAll] = await to(TOA_account.findOne({ 
        where: { account_id: accountId, status: 0, delete: 0 },
        attributes: ['account_id'],
        include : [{
            model: TOA_branch,
            as: 'branches',
            where: { status :0, delete: 0 },
            attributes: ['branch_id', 'branch_name'],
            required: false,
            include: [{
                model : TOA_student,
                as : 'students',
                where: { 
                    status : 0,
                    delete: 0
                },
                attributes: ['id'],
                required: false
            }]
        }]
    }));

    [err, cyrrencyType] = await to(TOA_currency.findAll({
        where: { status: 0, delete: 0 },
        attributes: ['id', 'title', 'sign', 'code']
    }));

    // calculate total income
    var incomeAll = [];
    
    await Promise.all(cyrrencyType.map(async (currency) => {
        [err, purchaseDetails] = await to(TOA_student_purchase.findAll({ 
            where: { account_id: accountId },
            attributes: ['account_id'],
            include : [{
                model: TOA_student_purchase_detail,
                as : 'payments',
                where: { currencyId: currency.id },
                attributes: ['currencyId', 'amount'],
                required: false
            }]
        }));
        var amount = 0;
        purchaseDetails.forEach(purchase => {
            if(purchase.payments){
                if(purchase.payments.amount){
                    amount = amount + purchase.payments.amount;
                }
            }
        });
        
        incomeAll.push({ title : currency.title, sign : currency.sign, code : currency.code, totalAmount : amount})
    }));
    // end calculate total income

    // calculate today income
    var incomeToday = [];

    await Promise.all(cyrrencyType.map(async (currency) => {
        [err, purchaseDetailsToday] = await to(TOA_student_purchase.findAll({ 
            where: { 
                account_id: accountId,
                createdAt : {
                    [Op.gte]: moment().format('YYYY-MM-DD'),
                    [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD')
                }
            },
            attributes: ['account_id'],
            include : [{
                model: TOA_student_purchase_detail,
                as : 'payments',
                where: { currencyId: currency.id },
                attributes: ['currencyId', 'amount'],
                required: false
            }]
        }));
        var amountToday = 0;
        purchaseDetailsToday.forEach(purchase => {
            if(purchase.payments){
                if(purchase.payments.amount){
                    amountToday = amountToday + purchase.payments.amount;
                }
            }
        });

        // let varName = currency.title;
        // incomeToday[varName] = { title : currency.title, sign : currency.sign, code : currency.code, totalAmount : amountToday};
        incomeToday.push({ title : currency.title, sign : currency.sign, code : currency.code, totalAmount : amountToday});

    }));
    // End calculate today income 

    // calculate total sold details
    var totalSellDetails = {
        subject : { soldQuantity : 0, income : []},
        topic : { soldQuantity : 0, income : []},
        content : { soldQuantity : 0, income : []},
        pdf : { soldQuantity : 0, income : []},
        ppt : { soldQuantity : 0, income : []},
        audio : { soldQuantity : 0, income : []},
        video : { soldQuantity : 0, income : []},
        test : { soldQuantity : 0, income : []},
        practice : { soldQuantity : 0, income : []},
        testBundle : { soldQuantity : 0, income : []}
    };

    for(let i=1; i<=10; i++){
        var incomeAllCat = [];
        await Promise.all(cyrrencyType.map(async (currency) => {
            [err, purchaseDetails] = await to(TOA_student_purchase.findAll({ 
                where: { account_id: accountId, type : i},
                attributes: ['account_id'],
                include : [{
                    model: TOA_student_purchase_detail,
                    as : 'payments',
                    where: { currencyId: currency.id },
                    attributes: ['currencyId', 'amount'],
                    required: false
                }]
            }));
            var amount = 0;
            purchaseDetails.forEach(purchase => {
                if(purchase.payments){
                    if(purchase.payments.amount){
                        amount = amount + purchase.payments.amount;
                    }
                }
            });
            incomeAllCat.push({ title : currency.title, sign : currency.sign, code : currency.code, totalAmount : amount});
            if(i == 1){
                totalSellDetails.subject.income = incomeAllCat;
                totalSellDetails.subject.soldQuantity = purchaseDetails.length;
            }
            if(i == 2){
                totalSellDetails.topic.income = incomeAllCat;
                totalSellDetails.topic.soldQuantity = purchaseDetails.length;
            }
            if(i == 3){
                totalSellDetails.content.income = incomeAllCat;
                totalSellDetails.content.soldQuantity = purchaseDetails.length;
            }
            if(i == 4){
                totalSellDetails.test.income = incomeAllCat;
                totalSellDetails.test.soldQuantity = purchaseDetails.length;
            }
            if(i == 5){
                totalSellDetails.practice.income = incomeAllCat;
                totalSellDetails.practice.soldQuantity = purchaseDetails.length;
            }
            if(i == 6){
                totalSellDetails.pdf.income = incomeAllCat;
                totalSellDetails.pdf.soldQuantity = purchaseDetails.length;
            }
            if(i == 7){
                totalSellDetails.ppt.income = incomeAllCat;
                totalSellDetails.ppt.soldQuantity = purchaseDetails.length;
            }
            if(i == 8){
                totalSellDetails.audio.income = incomeAllCat;
                totalSellDetails.audio.soldQuantity = purchaseDetails.length;
            }
            if(i == 9){
                totalSellDetails.video.income = incomeAllCat;
                totalSellDetails.video.soldQuantity = purchaseDetails.length;
            }
            if(i == 10){
                totalSellDetails.testBundle.income = incomeAllCat;
                totalSellDetails.testBundle.soldQuantity = purchaseDetails.length;
            }
        }));
    }
    // end calculate sold details

    // calculate active count
    const activeCount = {
        subject : subjectCount,
        topic : topicCount,
        content : contentCount,
        pdf : pdfCount,
        ppt : pptCount,
        audio : audioCount,
        video : videoCount,
        practice : practiceCount,
        test : testCount,
        bundle : bundleCount
    }
    // End calculate active count

    // calculate today registered user count
    var studentToday = 0;
    if(studentListToday){
        studentListToday.branches.forEach(branch => {
            if(branch.students.length){
                branch.students.forEach(student => {
                    studentToday++;
                });
            }
        });
    }
    // End calculate today registered user count

    // calculate total registered user count
    var studentAll = 0;
    if(studentListAll){
        studentListAll.branches.forEach(branch => {
            if(branch.students.length){
                branch.students.forEach(student => {
                    studentAll++;
                });
            }
        });
    }
    // End calculate total registered user count

    return { activeCount, registeredStudent : { today : studentToday, all : studentAll}, incomeTotal : incomeAll, incomeToday : incomeToday, totalSellDetails : totalSellDetails };

}
module.exports.getFilterDataByDate = getFilterDataByDate;

module.exports.getFilterDataByRequest = async function (accountId, type, currencyId){
    let amountCategorised = await amountCalculate(accountId, currencyId);

    // 1- Subject , 2 - Topic , 3 - Content , 4 - Test , 5 - Practice , 6 - PDF , 7 - PPT , 8 - Audio , 9 - Video , 10 - Test Bundle

    [err, subjectCount] = await to(TOA_subject.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, topicCount] = await to(TOA_topic.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, contentCount] = await to(TOA_content.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, pdfCount] = await to(TOA_pdf.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, pptCount] = await to(TOA_ppt.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, audioCount] = await to(TOA_audio.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, videoCount] = await to(TOA_video.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, practiceCount] = await to(TOA_practice.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, testCount] = await to(TOA_test.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, bundleCount] = await to(TOA_testbundle_Bundle.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    [err, tutorAll] = await to(TOA_tutor.count({where: { account_id: accountId, status: 0, delete: 0 } }));

    [err, studentListAll] = await to(TOA_account.findOne({ 
        where: { account_id: accountId, status: 0, delete: 0 },
        attributes: ['account_id'],
        include : [{
            model: TOA_branch,
            as: 'branches',
            where: { status :0, delete: 0 },
            attributes: ['branch_id', 'branch_name'],
            required: false,
            include: [{
                model : TOA_student,
                as : 'students',
                where: { 
                    status : 0,
                    delete: 0
                },
                attributes: ['id'],
                required: false
            }]
        }]
    }));

    // calculate active count
    const activeCount = {
        subject : subjectCount,
        topic : topicCount,
        content : contentCount,
        pdf : pdfCount,
        ppt : pptCount,
        audio : audioCount,
        video : videoCount,
        practice : practiceCount,
        test : testCount,
        bundle : bundleCount
    }
    // End calculate active count

    // calculate total registered user count
    var studentAll = 0;
    if(studentListAll){
        studentListAll.branches.forEach(branch => {
            if(branch.students.length){
                branch.students.forEach(student => {
                    studentAll++;
                });
            }
        });
    }
    // End calculate total registered user count

    if((type == "weekly") || (type != "monthly" && type != "yearly" && type != "all")){
        let days = [];
        let paymentArray = [];
        for(let i=6; i>=0; i--){
            let searchDay = moment().subtract(i,'days');
            days.push(searchDay.format('ddd'));
            let paymentData = await searchPaymentDayWise(accountId, currencyId, searchDay);
            paymentArray.push(paymentData);
        }
        return {activeCount, amount : amountCategorised, registeredStudent : studentAll, registeredTutor : tutorAll, chartData : charDataFormat(paymentArray), chartLables : days};
        
    } else if(type == "monthly"){
        let days = [];
        let paymentArray = [];
        let presentDay = moment().format('D');
        for(let i=presentDay-1; i >= 0; i--){
            let searchDay = moment().subtract(i,'days');
            days.push(searchDay.format('D'));
            let paymentData = await searchPaymentDayWise(accountId, currencyId, searchDay);
            paymentArray.push(paymentData);
        }
        return {activeCount, amount : amountCategorised, registeredStudent : studentAll, registeredTutor : tutorAll, chartData : charDataFormat(paymentArray), chartLables : days};
    } else if(type == "yearly"){
        let months = [];
        let paymentArray = [];
        let presentMonth = moment().format('MM');
        let presentYear = moment().format('YYYY');
        
        for(let i=1; i <= presentMonth; i++){
            let num = i.toString()
            if(i<=9){
                num = '0'+num;
            }
            let fromDate = presentYear+'-'+num+'-01';
            let formatedFromDate = moment(fromDate, ['YYYY-MM-DD']);
            let toDate = presentYear+'-'+num+'-'+lastDayOfMonth(new Date(presentYear,num, 15));
            let formatedToDate = moment(toDate, ['YYYY-MM-DD']);
            months.push(moment(fromDate).format('MMM'));
            let paymentData = await searchPaymentMonthWise(accountId, currencyId, formatedFromDate, formatedToDate);
            paymentArray.push(paymentData);
        }
        return {activeCount, amount : amountCategorised, registeredStudent : studentAll, registeredTutor : tutorAll, chartData : charDataFormat(paymentArray), chartLables : months};

    } else if(type == "all"){
        let years = [];
        let paymentArray = [];
        let presentYear = moment().format('YYYY');
        
        for(let i=2019; i <= presentYear; i++){
            let num = i.toString();
            let fromDate = num+'-01-01';
            let formatedFromDate = moment(fromDate, ['YYYY-MM-DD']);
            let toDate = i+'-12-'+lastDayOfMonth(new Date(i,12, 15));
            let formatedToDate = moment(toDate, ['YYYY-MM-DD']);
            years.push(i);
            let paymentData = await searchPaymentMonthWise(accountId, currencyId, formatedFromDate, formatedToDate);
            paymentArray.push(paymentData);
        }
        return {activeCount, amount : amountCategorised, registeredStudent : studentAll, registeredTutor : tutorAll, chartData : charDataFormat(paymentArray), chartLables : years};
    }
}

async function searchPaymentDayWise(accountId, currencyId, searchDay ){
    [err, purchaseDetails] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment(searchDay).add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment(searchDay).format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id','type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);
    return purchaseDetails;
}

async function searchPaymentMonthWise(accountId, currencyId, fromDate, toDate){
    [err, purchaseDetails] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment(toDate).add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment(fromDate).format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id','type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);
    return purchaseDetails;
}

function charDataFormat(arrayData){
    let formatedData = {
        subject : {
            data : [], lable : 'Course Bundles' //'Subject'
        },
        topic : {
            data : [], lable : 'Modules' //'Topic'
        },
        content : {
            data : [], lable : 'Lecture Content' //'Content'
        },
        pdf : {
            data : [], lable : 'PDF'
        },
        ppt : {
            data : [], lable : 'PPT'
        },
        audio : {
            data : [], lable : 'Audio'
        },
        video : {
            data : [], lable : 'Video'
        },
        test : {
            data : [], lable : 'Test'
        },
        practice : {
            data : [], lable : 'Practice'
        },
        testBundle : {
            data : [], lable : 'Test Bundle'
        }
    };
    arrayData.forEach((day, firstIndex = index) => {
        if(day.length){
            day.forEach((data, index) => {
                data = data.toJSON();

                if(data.type == 1){
                    if(data.total_amount){
                        formatedData.subject.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.subject.data.push(0);
                    }
                }

                if(data.type == 2){
                    if(data.total_amount){
                        formatedData.topic.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.topic.data.push(0);
                    }
                }

                if(data.type == 3){
                    if(data.total_amount){
                        formatedData.content.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.content.data.push(0);
                    }
                }

                if(data.type == 4){
                    if(data.total_amount){
                        formatedData.test.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.test.data.push(0);
                    }
                }

                if(data.type == 5){
                    if(data.total_amount){
                        formatedData.practice.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.practice.data.push(0);
                    }
                }

                if(data.type == 6){
                    if(data.total_amount){
                        formatedData.pdf.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.pdf.data.push(0);
                    }
                }

                if(data.type == 7){
                    if(data.total_amount){
                        formatedData.ppt.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.ppt.data.push(0);
                    }
                }

                if(data.type == 8){
                    if(data.total_amount){
                        formatedData.audio.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.audio.data.push(0);
                    }
                }

                if(data.type == 9){
                    if(data.total_amount){
                        formatedData.video.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.video.data.push(0);
                    }
                }

                if(data.type == 10){
                    if(data.total_amount){
                        formatedData.testBundle.data.push(data.total_amount.toFixed(2));
                    } else {
                        formatedData.testBundle.data.push(0);
                    }
                }
                if(index==day.length-1){
                    formatedData.subject.data[firstIndex] = formatedData.subject.data[firstIndex] ? formatedData.subject.data[firstIndex] : 0;
                    formatedData.topic.data[firstIndex] = formatedData.topic.data[firstIndex] ? formatedData.topic.data[firstIndex] : 0;
                    formatedData.content.data[firstIndex] = formatedData.content.data[firstIndex] ? formatedData.content.data[firstIndex] : 0;
                    formatedData.pdf.data[firstIndex] = formatedData.pdf.data[firstIndex] ? formatedData.pdf.data[firstIndex] : 0;
                    formatedData.ppt.data[firstIndex] = formatedData.ppt.data[firstIndex] ? formatedData.ppt.data[firstIndex] : 0;
                    formatedData.audio.data[firstIndex] = formatedData.audio.data[firstIndex] ? formatedData.audio.data[firstIndex] : 0;
                    formatedData.video.data[firstIndex] = formatedData.video.data[firstIndex] ? formatedData.video.data[firstIndex] : 0;
                    formatedData.test.data[firstIndex] = formatedData.test.data[firstIndex] ? formatedData.test.data[firstIndex] : 0;
                    formatedData.practice.data[firstIndex] = formatedData.practice.data[firstIndex] ? formatedData.practice.data[firstIndex]: 0;
                    formatedData.testBundle.data[firstIndex] = formatedData.testBundle.data[firstIndex] ? formatedData.testBundle.data[firstIndex]: 0;
                }
            });
            
        } else {
            formatedData.subject.data.push(0);
            formatedData.topic.data.push(0);
            formatedData.content.data.push(0);
            formatedData.pdf.data.push(0);
            formatedData.ppt.data.push(0);
            formatedData.audio.data.push(0);
            formatedData.video.data.push(0);
            formatedData.test.data.push(0);
            formatedData.practice.data.push(0);
            formatedData.testBundle.data.push(0);
        }
        
    });
    return formatedData;
}

function lastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}

async function amountCalculate(accountId, currencyId){
    let formatedAmountByType = {
        subject : { today : 0, week : 0, month : 0, year : 0 },
        topic : { today : 0, week : 0, month : 0, year : 0 },
        content : { today : 0, week : 0, month : 0, year : 0 },
        pdf : { today : 0, week : 0, month : 0, year : 0 },
        ppt : { today : 0, week : 0, month : 0, year : 0 },
        audio : { today : 0, week : 0, month : 0, year : 0 },
        video : { today : 0, week : 0, month : 0, year : 0 },
        test : { today : 0, week : 0, month : 0, year : 0 },
        practice : { today : 0, week : 0, month : 0, year : 0 },
        testBundle : { today : 0, week : 0, month : 0, year : 0 }
    };

    // amount today with currency type
    [err, amountToday] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment().format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id', 'type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);

    amountToday = amountByType(amountToday);
    formatedAmountByType.subject.today = amountToday.subject;
    formatedAmountByType.topic.today = amountToday.topic;
    formatedAmountByType.content.today = amountToday.content;
    formatedAmountByType.audio.today = amountToday.audio;
    formatedAmountByType.video.today = amountToday.video;
    formatedAmountByType.ppt.today = amountToday.ppt;
    formatedAmountByType.pdf.today = amountToday.pdf;
    formatedAmountByType.testBundle.today = amountToday.testBundle;
    formatedAmountByType.test.today = amountToday.test;
    formatedAmountByType.practice.today = amountToday.practice;

    // amount last 7 days
    let seventhDay = moment().subtract(6,'days');
    [err, amountLastSevenDays] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment(seventhDay).format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id', 'type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);
    amountLastSevenDays = amountByType(amountLastSevenDays);
    formatedAmountByType.subject.week = amountLastSevenDays.subject;
    formatedAmountByType.topic.week = amountLastSevenDays.topic;
    formatedAmountByType.content.week = amountLastSevenDays.content;
    formatedAmountByType.audio.week = amountLastSevenDays.audio;
    formatedAmountByType.video.week = amountLastSevenDays.video;
    formatedAmountByType.ppt.week = amountLastSevenDays.ppt;
    formatedAmountByType.pdf.week = amountLastSevenDays.pdf;
    formatedAmountByType.testBundle.week = amountLastSevenDays.testBundle;
    formatedAmountByType.test.week = amountLastSevenDays.test;
    formatedAmountByType.practice.week = amountLastSevenDays.practice;
    
    // amount this month
    let month = moment().format('MM');
    let year = moment().format('YYYY');
    let formatedFromDate = moment(year+'-'+month+'-01', ['YYYY-MM-DD']);
    [err, amountMonth] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment(formatedFromDate).format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id', 'type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);
    amountMonth = amountByType(amountMonth);
    formatedAmountByType.subject.month = amountMonth.subject;
    formatedAmountByType.topic.month = amountMonth.topic;
    formatedAmountByType.content.month = amountMonth.content;
    formatedAmountByType.audio.month = amountMonth.audio;
    formatedAmountByType.video.month = amountMonth.video;
    formatedAmountByType.ppt.month = amountMonth.ppt;
    formatedAmountByType.pdf.month = amountMonth.pdf;
    formatedAmountByType.testBundle.month = amountMonth.testBundle;
    formatedAmountByType.test.month = amountMonth.test;
    formatedAmountByType.practice.month = amountMonth.practice;

    // amount this year
    let formatedFrom = moment(year+'-01-01', ['YYYY-MM-DD']);
    [err, amountYear] = await to(TOA_student_purchase.findAll({ 
        where: { 
            account_id: accountId,
            createdAt : {
                [Op.lt]: moment().add(1, 'days').format('YYYY-MM-DD'),
                [Op.gte]: moment(formatedFrom).format('YYYY-MM-DD'),
            }
        },
        attributes: ['account_id', 'type', 'createdAt', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']],
        include : [{
            model: TOA_student_purchase_detail,
            as : 'payments',
            where: { 
                currencyId: currencyId 
            },
            attributes: ['currencyId', 'amount'],
            required: false
        }],
        group : ['type']
    }));
    if (err) TE(err.message);
    amountYear = amountByType(amountYear);
    formatedAmountByType.subject.year = amountYear.subject;
    formatedAmountByType.topic.year = amountYear.topic;
    formatedAmountByType.content.year = amountYear.content;
    formatedAmountByType.audio.year = amountYear.audio;
    formatedAmountByType.video.year = amountYear.video;
    formatedAmountByType.ppt.year = amountYear.ppt;
    formatedAmountByType.pdf.year = amountYear.pdf;
    formatedAmountByType.testBundle.year = amountYear.testBundle;
    formatedAmountByType.test.year = amountYear.test;
    formatedAmountByType.practice.year = amountYear.practice;

    return formatedAmountByType;
}

function amountByType(arrayData){
    let formatedAmountByType = {
        subject : 0,
        topic : 0,
        content : 0,
        pdf : 0,
        ppt : 0,
        audio : 0,
        video : 0,
        test : 0,
        practice : 0,
        testBundle : 0
    };

    arrayData.forEach(data => {
        let jsonData = data.toJSON();
        if(jsonData.type == 1){
            formatedAmountByType.subject = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 2){
            formatedAmountByType.topic = jsonData.total_amount ? jsonData.total_amount : 0;

        }
        if(jsonData.type == 3){
            formatedAmountByType.content = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 4){
            formatedAmountByType.test = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 5){
            formatedAmountByType.practice = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 6){
            formatedAmountByType.pdf = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 7){
            formatedAmountByType.ppt = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 8){
            formatedAmountByType.audio = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 9){
            formatedAmountByType.video = jsonData.total_amount ? jsonData.total_amount : 0;
        }
        if(jsonData.type == 10){
            formatedAmountByType.testBundle = jsonData.total_amount ? jsonData.total_amount : 0;
        }
    });

    return formatedAmountByType;
}

// if(!filterData.fromDate){
//     filterData.fromDate = new Date();
// }
// if(!filterData.toDate){
//     filterData.toDate = new Date();
// } else if(moment((filterData.toDate / 1000)*1000).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
//     filterData.toDate = moment().format('YYYY-MM-DD');
// }
// [err, studentList] = await to(TOA_account.findOne({
//     where: { account_id: accountId,  delete: 0 },
//     attributes: ['account_id'],
//     include : [{
//         model: TOA_branch,
//         as: 'branches',
//         where: { delete: 0 },
//         attributes: ['branch_id', 'branch_name'],
//         order: [['createdAt', 'DESC']],
//         include: [{
//             model : TOA_student,
//             as : 'students',
//             where: { 
//                 delete: 0,
//                 createdAt : {
//                     [Op.gte]: moment((filterData.fromDate / 1000)*1000).format('YYYY-MM-DD'),
//                     [Op.lt]: moment((filterData.toDate / 1000)*1000).add(1, 'days').format('YYYY-MM-DD'),
//                 }
//             },
//             attributes: ['id', 'image', 'first_name', 'last_name', 'phone', 'email', 'gender'],
//             order: [['createdAt', 'DESC']]
//         }]
//     }]
// }));
// if (err) TE(err.message);
// return studentList;

