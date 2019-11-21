const { TOA_branch, TOA_city, TOA_country } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// ---------------------------------------------- Branch ---------------------------------------------- 

module.exports.userExist = async function (email) {

    [err, users] = await to(TOA_branch.findOne({ where: {  branch_email: email } }));
    if (err) TE(err.message);
    return users;
}

// Add New Branch
const addBranch = async function (branchJson) {

    [err, branch] = await to(TOA_branch.create(branchJson));
    if (err) TE(err.message);
    return branch;
}
module.exports.addBranch = addBranch;

// // Update Branch
const updateBranch = async function (branchId, branchJson) {

    [err, branch] = await to(TOA_branch.update(branchJson, { where: { branch_id: branchId } }));
    if (err) TE(err.message);
    return branch;
}
module.exports.updateBranch = updateBranch;

// Get All Branch List
const getBranchList = async function (accountId, isFiltered) {


    var attributesList =  [['branch_id', 'id'],'CODE', ['branch_manager','manager'],['branch_name', 'name'], 'contactCountryCode',['branch_number', 'number'], ['branch_email', 'email'], 'altcontactCountryCode' ,['branch_altnumber', 'altNumber'], ['branch_address', 'address'], 'pincode', ['branch_latitude', 'latitude'], ['branch_longitude', 'longitude'],'billingAddress' , 'panNumber' , 'gstNumber', 'status'];

    if(isFiltered){

        attributesList =  [['branch_id', 'id'], ['branch_name', 'name']];
    }

    [err, branchList] = await to(TOA_branch.findAll({
        where: { account_id: accountId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: attributesList,
        include: [
            {
                model: TOA_city,
                as: 'city',
                attributes: ['id', 'title'],
                required: false,
                include: [
                    {
                        model: TOA_country,
                        as: 'country',
                        attributes: ['id', 'title']
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return branchList;

}
module.exports.getBranchList = getBranchList;

// Get Single Branch
module.exports.getBranch = async function (accountId, branchId) {

    [err, branch] = await to(TOA_branch.findOne({
        where: { account_id: accountId, branch_id: branchId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['branch_id', 'id'], 'CODE', ['branch_manager','manager'],['branch_name', 'name'], 'contactCountryCode',['branch_number', 'number'], ['branch_email', 'email'], 'altcontactCountryCode' ,['branch_altnumber', 'altNumber'], ['branch_address', 'address'], 'pincode', ['branch_latitude', 'latitude'], ['branch_longitude', 'longitude'],'billingAddress' , 'panNumber' , 'gstNumber','status'],
        include: [
            {
                model: TOA_city,
                as: 'city',
                attributes: ['id', 'title'],
                required: false,
                include: [
                    {
                        model: TOA_country,
                        as: 'country',
                        attributes: ['id', 'title']
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return branch;
}


// Get Single Branch By Branch Name
module.exports.getBranchByName = async function (accountId, branchName) {

    
    
    [err, branch] = await to(TOA_branch.findOne({

        where: { account_id: accountId, delete: 0 , branch_name : { [Op.like]: '%'+ branchName  +'%' }},
        attributes: [['branch_id', 'id'], ['branch_manager','manager'],['branch_name', 'name'], 'contactCountryCode',['branch_number', 'number'], 'altcontactCountryCode' ,['branch_altnumber', 'altNumber'], ['branch_address', 'address'], ['branch_latitude', 'latitude'], ['branch_longitude', 'longitude'],'status'],
        include: [
            {
                model: TOA_city,
                as: 'city',
                attributes: ['id', 'title'],
                required: false,
                include: [
                    {
                        model: TOA_country,
                        as: 'country',
                        attributes: ['id', 'title']
                    }
                ]
            }
        ]
        
    }));

    if (err) TE(err.message);
    return branch;
}

// Delete Branch
const deleteBranch = async function (accountId, branchId) {

    const branchJson = {delete: 1};
    [err, branch] = await to(TOA_branch.update(branchJson, { where: { account_id: accountId, branch_id: branchId } }));
    if (err) TE(err.message);
    return branch;

}
module.exports.deleteBranch = deleteBranch;

// ---------------------------------------------- Branch ---------------------------------------------- 