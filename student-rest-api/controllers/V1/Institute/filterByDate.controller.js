const filterByDate = require('../../../services/V1/Institute/filterByDate.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


// Get Data by Date List
module.exports.getDataByDate = async function (req, res) {

    [err, filterData] = await to(filterByDate.getFilterDataByDate(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (filterData.length == 0) {

        return ReE(res, 'No data Available', 204);

    } else {

        return ReS(res, 'All Register Student Got Successfully.', filterData);
    }

}

// Get data for chart
module.exports.dataForChart = async function(req, res){
    const body = req.fields;
    if(!body.type) return ReE(res, 'Please select type', 422);
    if(!body.currencyId) return ReE(res, 'Please select currency', 422);
    [err, filterData] = await to(filterByDate.getFilterDataByRequest(req.user.account_id, body.type, body.currencyId));
    if (err) return ReE(res, err, 422);
    return ReS(res, 'Chart data Got Successfully.', filterData);
}
