const currencyService = require('../../../services/V1/Superadmin/Currency.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


module.exports.addCurrency = async function (req, res) {

    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.sign) {

        return ReE(res, 'Please enter sign.', 422);

    } else if (!body.code) {

        return ReE(res, 'Please enter code.', 422);

    } else {

        var currencyBody = body;
        currencyBody.create_ip = req.ip;

        [err, currency] = await to(currencyService.addCurrency(currencyBody));
        if (err) return ReE(res, err, 422);

        if (currency) {

            [err, currency] = await to(currencyService.getCurrency(currency.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Currency added successfully.', currency);

        } else {

            return ReE(res, 'Failed to add currency, please try again.', 422);
        }
    }
}


module.exports.getCurrencyList = async function (req, res) {

    [err, currencyList] = await to(currencyService.getCurrencyList());
    if (err) return ReE(res, err, 422);

    if (currencyList.length == 0) {

        return ReE(res, 'Currencys Not Available', 204);

    } else {

        return ReS(res, 'All Currency List Got Successfully.', currencyList);
    }
}

module.exports.updateCurrency = async function (req, res) {

    const body = req.fields;
    if (!body.currencyId) {

        return ReE(res, 'Please enter currency id.', 422);

    } else {

        [err, currencyFound] = await to(currencyService.getCurrency(body.currencyId));
        if (err) return ReE(res, err, 422);

        if (currencyFound) {
            
            let currencyBody = body;
            currencyBody.update_ip = req.ip;

            [err, currency] = await to(currencyService.updateCurrency(body.currencyId, currencyBody));
            if (err) return ReE(res, err, 422);

            if (currency.length === 1 && currency[0] == 1) {

                [err, currency] = await to(currencyService.getCurrency(body.currencyId));
                return ReS(res, 'Currency updated successfully.', currency);

            } else {

                return ReE(res, 'Failed to update currency, please try again.', 422);
            }
        } else {

            return ReE(res, 'Currency not found.', 422);
        }

    }
}

module.exports.deleteCurrency = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Currency id missing.');

    } else {

        [err, currency] = await to(currencyService.deleteCurrency(req.params.id));
        if (err) return ReE(res, err, 422);
        if (currency.length === 1 && currency[0] == 1) {

            return ReS(res, 'Currency deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete currency. please try again.');
        }
    }
}