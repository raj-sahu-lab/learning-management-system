const menuService = require('../../../services/V1/Superadmin/MenuManagment.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');
const fs = require('fs');

module.exports.uploadCountryCity = async function (req, res) {
    
    let rawdata = fs.readFileSync(req.files.json.path);
    let couuntryCity = JSON.parse(rawdata);

    var countryList = [];
    await Promise.all(couuntryCity.country.map(async (country) => {


        var cityList = [];

        await Promise.all(country.cities.map(async (city) => {

            cityList.push({ country_id : country.id , title : city.replace("/", "")});
        }));

        
        [err, menuList] = await to(menuService.uploadCountryCity(cityList));
        if (err) return ReE(res, err, 422);
        countryList.push(menuList);

    }));
    return ReS(res, 'Country List.', countryList);
}

module.exports.getAllMenuSubMenu = async function (req, res) {
    [err, menuList] = await to(menuService.getAllMenuSubMenu());
    if (err) return ReE(res, err, 422);

    if (menuList.length == 0) {

        return ReE(res, 'Menus Not Available', 204);

    } else {

        return ReS(res, 'All Menu List Got Successfully.', menuList);
    }
}


// Add New Menu
module.exports.addMenu = async function (req, res) {

    const body = req.fields;

     if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let menuBody = {
            title: body.title,
            description: body.description,
            nav_link: body.navLink,
            create_ip: req.ip,
        };

        [err, menu] = await to(menuService.addMenu(menuBody));
        if (err) return ReE(res, err, 422);

        if (menu) {

            [err, menu] = await to(menuService.getMenu(menu.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Menu added successfully.', menu);

        } else {

            return ReE(res, 'Failed to add menu, please try again.', 422);
        }
    }
}

// Update Menu
module.exports.getMenuList = async function (req, res) {

    [err, menuList] = await to(menuService.getMenuList());
    if (err) return ReE(res, err, 422);

    if (menuList.length == 0) {

        return ReE(res, 'Menus Not Available', 204);

    } else {

        return ReS(res, 'All Menu List Got Successfully.', menuList);
    }
}

// Get All Menu List
module.exports.updateMenu = async function (req, res) {

    const body = req.fields;
    if (!body.menuId) {

        return ReE(res, 'Please enter menu id.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let menuBody = {
            
            title: body.title,
            description: body.description,
            nav_link: body.navLink,
            update_ip: req.ip,
            status: body.status
        };

        [err, menu] = await to(menuService.updateMenu(body.menuId, menuBody));
        if (err) return ReE(res, err, 422);

        if (menu.length === 1 && menu[0] == 1) {

            [err, menu] = await to(menuService.getMenu(body.menuId));
            return ReS(res, 'Menu updated successfully.', menu);

        } else {

            return ReE(res, 'Failed to update menu, please try again.', 422);
        }
    }
}

// Delete Menu
module.exports.deleteMenu = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Menu id missing.');

    } else {

        [err, menu] = await to(menuService.deleteMenu( req.params.id));
        if (err) return ReE(res, err, 422);
        if (menu.length === 1 && menu[0] == 1) {

            return ReS(res, 'Menu deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete menu. please try again.');
        }
    }
}


// ============================== Sub Menu ==============================
// Add New Menu Sub
module.exports.addSubMenu = async function (req, res) {

    const body = req.fields;

    if(body.menuId == null){

        return ReE(res, 'Menu Id missing.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let subMenuBody = {
            menu_id: body.menuId,
            title: body.title,
            description: body.description,
            nav_link: body.navLink,
            create_ip: req.ip,
        };

        [err, submenu] = await to(menuService.addSubMenu(subMenuBody));
        if (err) return ReE(res, err, 422);

        if (submenu) {

            [err, submenu] = await to(menuService.getSubMenu(submenu.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'SubMenu added successfully.', submenu);

        } else {

            return ReE(res, 'Failed to add submenu, please try again.', 422);
        }
    }
}

// Get All Menu Sub List
module.exports.getSubMenuList = async function (req, res) {

    [err, menuList] = await to(menuService.getSubMenuList());
    if (err) return ReE(res, err, 422);

    if (menuList.length == 0) {

        return ReE(res, 'SubMenus Not Available', 204);

    } else {

        return ReS(res, 'All SubMenu List Got Successfully.', menuList);
    }
}

// Update Menu Sub
module.exports.updateSubMenu = async function (req, res) {

    const body = req.fields;
    if (!body.subMenuId) {

        return ReE(res, 'Please enter submenu id.', 422);

    } else if(body.menuId == null){

        return ReE(res, 'Menu Id missing.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else {

        let subMenuBody = {
            
            menu_id: body.menuId,
            title: body.title,
            description: body.description,
            nav_link: body.navLink,
            update_ip: req.ip,
            status: body.status
        };

        [err, submenu] = await to(menuService.updateSubMenu(body.subMenuId, subMenuBody));
        if (err) return ReE(res, err, 422);

        if (submenu.length === 1 && submenu[0] == 1) {

            [err, submenu] = await to(menuService.getSubMenu(body.subMenuId));
            return ReS(res, 'SubMenu updated successfully.', submenu);

        } else {

            return ReE(res, 'Failed to update submenu, please try again.', 422);
        }
    }
}

// Delete Menu Sub
module.exports.deleteSubMenu = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'SubMenu id missing.');

    } else {

        [err, submenu] = await to(menuService.deleteSubMenu( req.params.id));
        if (err) return ReE(res, err, 422);
        if (submenu.length === 1 && submenu[0] == 1) {

            return ReS(res, 'SubMenu deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete submenu. please try again.');
        }
    }
}