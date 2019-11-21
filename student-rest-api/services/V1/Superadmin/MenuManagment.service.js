const { TOA_Tutor_menu , TOA_Tutor_sub_menu ,TOA_city } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.uploadCountryCity = async function (json) {
    [err, menu] = await to(TOA_city.bulkCreate(json));
    if (err) TE(err.message);
    return menu;
}

// Get All Menu And Sub Menu List
module.exports.getAllMenuSubMenu = async function () {

    
    [err, menuList] = await to(TOA_Tutor_menu.findAll({
        where: { delete: 0 , status: 1},
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'description'],
        include:[{
            
            model: TOA_Tutor_sub_menu,
            where: { delete: 0 , status: 1},
            as: 'subMenu',
            attributes: [ 'id', 'title' , 'description'],
        }]
    }));
    if (err) TE(err.message);
    return menuList;

}



// Add New Menu
module.exports.addMenu = async function (menuInfo) {

    [err, menu] = await to(TOA_Tutor_menu.create(menuInfo));
    if (err) TE(err.message);
    return menu;
}

// Update Menu
module.exports.updateMenu = async function (menuId, menuInfo) {

    [err, menu] = await to(TOA_Tutor_menu.update(menuInfo, { where: { id: menuId } }));
    if (err) TE(err.message);
    return menu;
}

// Get All Menu List
module.exports.getMenuList = async function () {

    
    [err, menuList] = await to(TOA_Tutor_menu.findAll({
        where: { delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'description', 'nav_link', 'status'],
    }));
    if (err) TE(err.message);
    return menuList;

}


// Get Menu
module.exports.getMenu = async function (menuId) {

    [err, menu] = await to(TOA_Tutor_menu.findOne({
        where: { id: menuId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'description', 'nav_link', 'status'],
    }));
    if (err) TE(err.message);
    return menu;

}

// Delete Menu
module.exports.deleteMenu = async function (menuId) {

    const menuJson = {delete: 1};
    [err, menu] = await to(TOA_Tutor_menu.update(menuJson, { where: {id: menuId } }));
    if (err) TE(err.message);
    return menu;

}


// ============================== Sub Menu ==============================
// Add New Menu Sub
module.exports.addSubMenu = async function (menuSubInfo) {

    [err, menuSub] = await to(TOA_Tutor_sub_menu.create(menuSubInfo));
    if (err) TE(err.message);
    return menuSub;
}

// Update Menu Sub
module.exports.updateSubMenu = async function (menuSubId, menuSubInfo) {

    [err, menuSub] = await to(TOA_Tutor_sub_menu.update(menuSubInfo, { where: { id: menuSubId } }));
    if (err) TE(err.message);
    return menuSub;
}

// Get All Menu Sub List
module.exports.getSubMenuList = async function () {

    
    [err, menuList] = await to(TOA_Tutor_sub_menu.findAll({
        where: { delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'description', 'nav_link', 'status'],
        include: [
            {
                model: TOA_Tutor_menu,
                as: 'menu',
                attributes: [ 'id', 'title' , 'description', 'nav_link', 'status']
            }
        ]
    }));
    if (err) TE(err.message);
    return menuList;

}


// Get Menu Sub
module.exports.getSubMenu = async function (menuSubId) {

    [err, menuSub] = await to(TOA_Tutor_sub_menu.findOne({
        where: { id: menuSubId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [ 'id', 'title' , 'description', 'nav_link', 'status'],
        include: [
            {
                model: TOA_Tutor_menu,
                as: 'menu',
                attributes: [ 'id', 'title' , 'description', 'nav_link', 'status']
            }
        ]
    }));
    if (err) TE(err.message);
    return menuSub;

}

// Delete Menu Sub
module.exports.deleteSubMenu = async function (menuSubId) {

    const menuJson = {delete: 1};
    [err, menuSub] = await to(TOA_Tutor_sub_menu.update(menuJson, { where: {id: menuSubId } }));
    if (err) TE(err.message);
    return menuSub;

}
// ============================== Sub Menu ==============================


module.exports.getMenuSubMenuFor = async function (menuId, subMenuIds) {

    
    [err, menuList] = await to(TOA_Tutor_menu.findOne({
        where: { id: menuId , delete: 0 , status: 1},
        attributes: [ 'title' , 'description'],
        include:[{
            
            model: TOA_Tutor_sub_menu,
            where: { id: [ subMenuIds.split(",") ] ,delete: 0 , status: 1},
            as: 'subMenu',
            attributes: ['title' , 'description'],
        }]
    }));
    if (err) TE(err.message);
    return menuList;

}