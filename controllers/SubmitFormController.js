const Request = require('../models/Request');
const HeyatModireForm = require('../models/HeyatModireForm');
const Common = require('../controllers/Common');
const UserPreAns = require('../models/UserPreAns');
const Sequelize = require('sequelize');
const formidable = require('formidable');
const JavazForm = require('../models/JavazForm');
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});
const fs = require('fs');

function generateCode() {
    return parseInt(Math.random() * (999999 - 100000) + 100000);
}

function doUpload(req, res, attrId, mode) {

    let fileName = "";

    let form = new formidable.IncomingForm();
    form.parse(req);
    let date = new Date();

    form.on('fileBegin', function (name, file) {

        let arrTmp = file.name.split('.');

        fileName = date.getTime() + "_" + parseInt(Math.random() * (999999 - 100000) + 100000) + "." + arrTmp[arrTmp.length - 1];
        file.path = __dirname + "/../assets/storage/" + fileName;
    });

    form.on('file', function (name, file) {

        if(file.size > 2000000) {
            fs.unlinkSync(file.path);
            return res.send(JSON.stringify({'status': 'nok', 'attrId': attrId, 'error': "حجم آپلود شده، بیش از حد مجاز است."}));
        }

        if(mode === "preCond" || mode === "preActor") {
            UserPreAns.findOne({where: {attr_id: attrId, user_id: req.session.user.id}}).then(tmp => {

                if (tmp == null) {
                    UserPreAns.create({
                        ans: fileName,
                        attr_id: attrId,
                        user_id: req.session.user.id,
                        mode: (mode === "preCond")
                    });
                }
                else {
                    fs.unlinkSync(__dirname + "/../assets/storage/" + tmp.ans);
                    tmp.update({
                        ans: fileName,
                    });
                }
            });
        }
        else {
            sequelize.query("insert into user_post_ans (ans, attr_id, user_id) values (?, ?, ?)", {
                type: Sequelize.QueryTypes.INSERT,
                replacements: [fileName, attrId, req.session.user.id]
            }).catch(x => {
                sequelize.query("select ans, id from user_post_ans where attr_id = ? and user_id = ?", {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: [attrId, req.session.user.id]
                }).then(tmp => {
                    tmp = tmp[0];
                    fs.unlinkSync(__dirname + "/../assets/storage/" + tmp.ans);
                    sequelize.query("update user_post_ans set ans = ? where id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [fileName, tmp.id]
                    })
                });
            });
        }

        return res.send(JSON.stringify({'status': 'ok', 'attrId': attrId}));
    });
}

exports.uploadUserFilePrePost = function(req, res) {

    let instId = req.params.instId;
    let mode = req.params.mode;
    let attrId = req.params.attrId;

    let requires = [instId, attrId];

    if(mode === "preCond") {
        sequelize.query("select id from preconditions where type = 5 and instruction_id = ? and id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: requires
        }).then(tmp => {
            if(tmp == null)
                return res.status(404);
            doUpload(req, res, tmp[0].id, mode);
        });
    }

    if(mode === "preActor") {
        sequelize.query("select id from pre_actors where type = 5 and instruction_id = ? and id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: requires
        }).then(tmp => {
            if(tmp == null)
                return res.status(404);
            doUpload(req, res, tmp[0].id, mode);
        });
    }

    if(mode === "post") {
        sequelize.query("select id from post_conditions where type = 5 and instruction_id = ? and id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: requires
        }).then(tmp => {
            if(tmp == null)
                return res.status(404);
            return doUpload(req, res, tmp[0].id, mode);
        });
    }
};

function createNewRequest(instId, userId) {

    return sequelize.query("select id from requests where user_id = ? and instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId, instId]
    }).then(request => {

        if (request != null && request.length > 0) {
            return request[0].id;
        }
        else {

            let code = generateCode();
            let where = {follow_code: code};

            return Request.findOne({where: where}).then(request => {

                if (request != null)
                    return createNewRequest(instId, userId);
                else {
                    return sequelize.query("insert into requests (user_id, instruction_id, follow_code) values (?, ?, ?)",{
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [userId, instId, code]
                    }).then(tmp => {
                        return tmp[0];
                    }).catch(x => {
                        return -1;
                    });
                }
            });
        }
    });
}

exports.getRequestMembers = function(req, res) {

    let instId = req.body.instId;
    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if (reqId === -1) {
                res.send(JSON.stringify({'status': 'ok', 'users': []}, 4, null));
            }
            else {
                let where = {request_id: reqId};
                HeyatModireForm.findAll({where: where}).then(users => {

                    if (users == null || users.length === 0) {
                        res.send(JSON.stringify({'status': 'ok', 'users': []}, 4, null));
                        return;
                    }

                    let arr = [];
                    for (let i = 0; i < users.length; i++) {
                        arr[i] = users[i].dataValues;
                    }

                    res.send(JSON.stringify({'status': 'ok', 'users': arr}, 4, null));
                });
            }
        });
};

exports.getJavazHa = function(req, res) {

    let instId = req.body.instId;
    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if (reqId === -1) {
                res.send(JSON.stringify({'status': 'ok', 'users': []}, 4, null));
            }
            else {
                JavazForm.findAll({where: {request_id: reqId}}).then(users => {

                    if (users == null || users.length === 0) {
                        res.send(JSON.stringify({'status': 'ok', 'users': []}, 4, null));
                        return;
                    }

                    let arr = [];
                    for (let i = 0; i < users.length; i++) {
                        arr[i] = users[i].dataValues;
                    }

                    res.send(JSON.stringify({'status': 'ok', 'users': arr}, 4, null));
                });
            }
        });
};

exports.submitHaghighiForm = function(req, res) {

    let instId = req.body.instId;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let nid = req.body.nid;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let city_id = req.body.city_id;

    let errs = [];

    if(first_name === undefined || first_name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if(last_name === undefined || last_name.length === 0)
        errs[errs.length] = "نام خانوادگی نامعتبر است";

    if (!Common.isValidNumber(instId) || !Common.isValidNumber(city_id))
        errs[errs.length] = "درخواست نامعتبر است";

    if (!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if(email === undefined || email.length === 0)
        errs[errs.length] = "پست الکترونیک نامعتبر است";

    if(address === undefined || address.length === 0)
        errs[errs.length] = "آدرس نامعتبر است";

    if (!Common.isValidNumber(phone) || phone.length !== 11)
        errs[errs.length] = "شماره همراه نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            }
            else {
                sequelize.query("insert into haghighi_forms (request_id, first_name, last_name, nid, phone, mail, city_id, address) values (?, ?, ?, ?, ?, ?, ?, ?)", {
                   type: Sequelize.QueryTypes.INSERT,
                   replacements: [reqId, first_name, last_name, nid, phone, email, city_id, address]
                }).then(tmp => {
                    res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/3/' + instId}));
                }).catch(x => {
                    sequelize.query("update haghighi_forms set first_name = ?, last_name = ?, nid = ?, phone = ?, mail = ?, city_id = ?, address = ? where request_id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [first_name, last_name, nid, phone, email, city_id, address, reqId]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/3/' + instId}));
                    });
                });
            }
        });
};

exports.submitHoghoghiForm = function (req, res) {

    let errs = [];

    errs = validateContactsInfo(req);

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    let instId = req.body.instId;
    let name = req.body.name;
    let company_kind = req.body.company_kind;
    let company_no = req.body.company_no;
    let submit_date_day = req.body.submit_date_day;
    let submit_date_month = req.body.submit_date_month;
    let submit_date_year = req.body.submit_date_year;
    let nid = req.body.nid;
    let pre_tel = req.body.pre_tel;
    let pre_namabar = req.body.pre_namabar;
    let economy_code = req.body.economy_code;
    let city_id = req.body.city_id;
    let addr = req.body.address;
    let post_code = req.body.post_code;
    let tel = req.body.tel;
    let namabar = req.body.namabar;
    let email = req.body.email;
    let site = req.body.site;

    if(name === undefined || name.length === 0)
        errs[errs.length] = "نام حقیقی نامعتبر است";

    if (!Common.isValidNumber(company_no))
        errs[errs.length] = "شماره ثبت نامعتبر است";

    if (!Common.isValidNumber(instId))
        errs[errs.length] = "درخواست نامعتبر است";

    if (!Common.isValidNumber(economy_code))
        errs[errs.length] = "کد اقتصادی نامعتبر است";

    if (!Common.isValidNumber(company_kind) ||
        (
            parseInt(company_kind) !== 1 &&
            parseInt(company_kind) !== 2 &&
            parseInt(company_kind) !== 3 &&
            parseInt(company_kind) !== 4 &&
            parseInt(company_kind) !== 5
        )
    )
        errs[errs.length] = "نوع شرکت نامعتبر است";

    if (!Common.isValidNumber(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if(!Common.isValidNumber(submit_date_day) || !Common.isValidNumber(submit_date_month) || !Common.isValidNumber(submit_date_year))
        errs[errs.length] = "تاریخ ثبت نامعتبر است";

    let submite_date = submit_date_year + "/" + submit_date_month + "/" + submit_date_day;

    if(submite_date.length > 10)
        errs[errs.length] = "تاریخ ثبت نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([Common.isValidPreTel(pre_tel, city_id), Common.isValidPreTel(pre_namabar, city_id)]).then(function (result) {

        if (!result[0]) {
            errs[errs.length] = "استان یا تلفن وارد شده نامعتبر است";
        }

        if (!result[1]) {
            errs[errs.length] = "استان یا نمابر وارد شده نامعتبر است";
        }

        if (errs.length > 0) {
            res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            return;
        }

        Promise.all([
            createNewRequest(instId, req.session.user.id)
        ])
            .then(function (result) {
                let reqId = result[0];
                if (reqId === -1) {
                    errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                    res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
                }
                else {
                    sequelize.query("insert into hoghoghi_forms (request_id, name, namabar, pre_namabar, tel, pre_tel, submit_date, company_kind, company_no, nid, city_id, economy_code, address, post_code, mail, site) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [reqId, name, namabar, pre_namabar, tel, pre_tel, submite_date, company_kind,
                            company_no, nid, city_id, economy_code, addr, post_code, email, site
                        ]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/2/' + instId}));
                    }).catch(x => {
                        console.log("catch in hoghoghi_forms " + x);
                        sequelize.query("update hoghoghi_forms set name = ?, namabar = ?, pre_namabar = ?, tel = ?, pre_tel = ?, submit_date = ?, company_kind = ?, company_no = ?, nid = ?, city_id = ?, economy_code = ?, address = ?, post_code = ?, mail = ?, site = ? where request_id = ?", {
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements: [name, namabar, pre_namabar, tel, pre_tel, submite_date, company_kind,
                                company_no, nid, city_id, economy_code, addr, post_code, email, site, reqId
                            ]
                        }).then(tmp => {
                            res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/2/' + instId}));
                        });
                    });
                }
            });
    });
};

exports.submitSenfForm = function (req, res) {

    let errs = [];

    errs = validateContactsInfo(req);

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    let instId = req.body.instId;
    let name = req.body.name;
    let pre_tel = req.body.pre_tel;
    let pre_namabar = req.body.pre_namabar;
    let economy_code = req.body.economy_code;
    let city_id = req.body.city_id;
    let addr = req.body.address;
    let post_code = req.body.post_code;
    let tel = req.body.tel;
    let namabar = req.body.namabar;
    let email = req.body.email;
    let site = req.body.site;
    let phone = req.body.phone;

    if(name === undefined || name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if (!Common.isValidNumber(instId))
        errs[errs.length] = "درخواست نامعتبر است";

    if (!Common.isValidNumber(economy_code))
        errs[errs.length] = "کد اقتصادی نامعتبر است";

    if (!Common.isValidNumber(phone) || phone.length !== 11)
        errs[errs.length] = "شماره همراه نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([Common.isValidPreTel(pre_tel, city_id), Common.isValidPreTel(pre_namabar, city_id)]).then(function (result) {

        if (!result[0]) {
            errs[errs.length] = "استان یا تلفن وارد شده نامعتبر است";
        }

        if (!result[1]) {
            errs[errs.length] = "استان یا نمابر وارد شده نامعتبر است";
        }

        if (errs.length > 0) {
            res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            return;
        }

        Promise.all([
            createNewRequest(instId, req.session.user.id)
        ])
            .then(function (result) {
                let reqId = result[0];
                if (reqId === -1) {
                    errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                    res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
                }
                else {

                    sequelize.query("insert into senf_forms (request_id, name, namabar, pre_namabar, tel, pre_tel, city_id, economy_code, address, post_code, mail, site, phone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [reqId, name, namabar, pre_namabar, tel, pre_tel, city_id, economy_code, addr, post_code, email, site, phone]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/2/1/' + instId}));
                    }).catch(x => {
                        sequelize.query("update senf_forms set name = ?, namabar = ?, pre_namabar = ?, tel = ?, pre_tel = ?, city_id = ?, economy_code = ?, address = ?, post_code = ?, mail = ?, site = ?, phone = ? where request_id = ?", {
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements: [name, namabar, pre_namabar, tel, pre_tel, city_id, economy_code, addr, post_code, email, site, phone, reqId]
                        }).then(tmp => {
                            res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/2/1/' + instId}));
                        });
                    });
                }
            });
    });
};

function validateContactsInfo(req) {

    let errs = [];

    let pre_tel = req.body.pre_tel;
    let pre_namabar = req.body.pre_namabar;
    let tel = req.body.tel;
    let namabar = req.body.namabar;
    let addr = req.body.address;
    let post_code = req.body.post_code;
    let email = req.body.email;
    let city_id = req.body.city_id;

    if(addr === undefined || addr.length === 0)
        errs[errs.length] = "آدرس نامعتبر است";

    if(email === undefined || email.length === 0)
        errs[errs.length] = "پست الکترونیک نامعتبر است";

    if (!Common.isValidNumber(tel) || !Common.isValidNumber(pre_tel) || tel.length > 8)
        errs[errs.length] = "تلفن ثابت نامعتبر است";

    if (namabar.length > 0 && (!Common.isValidNumber(namabar) || !Common.isValidNumber(pre_namabar) || namabar.length !== 8))
        errs[errs.length] = "نمابر نامعتبر است";

    if (!Common.isValidNumber(post_code) || post_code.length !== 10)
        errs[errs.length] = "کد پستی شما نامعتبر است";

    if (!Common.isValidNumber(city_id))
        errs[errs.length] = "شهر نامعتبر است";

    return errs;
}

exports.submitNamayandeForm = function(req, res) {

    let instId = req.body.instId;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let nid = req.body.nid;
    let email = req.body.email;
    let phone = req.body.phone;

    let errs = [];

    if(first_name === undefined || first_name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if(last_name === undefined || last_name.length === 0)
        errs[errs.length] = "نام خانوادگی نامعتبر است";

    if (!Common.isValidNumber(instId))
        errs[errs.length] = "درخواست نامعتبر است";

    if (!Common.isValidNumber(phone) || phone.length !== 11)
        errs[errs.length] = "شماره همراه نامعتبر است";

    if (!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if(email === undefined || email.length === 0)
        errs[errs.length] = "پست الکترونیک نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            }
            else {
                sequelize.query("insert into namayande_forms (request_id, first_name, last_name, nid, phone, mail) values (?, ?, ?, ?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [reqId, first_name, last_name, nid, phone, email]
                }).then(tmp => {
                    res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/2/1/' + instId}));
                }).catch(x => {
                    sequelize.query("update namayande_forms set first_name = ?, last_name = ?, nid = ?, phone = ?, mail = ? where request_id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [first_name, last_name, nid, phone, email, reqId]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/2/1/' + instId}));
                    });
                });
            }
        });

};

exports.submitModiramelForm = function (req, res) {

    let instId = req.body.instId;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let nid = req.body.nid;
    let email = req.body.email;
    let phone = req.body.phone;

    let errs = [];

    if(first_name === undefined || first_name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if(last_name === undefined || last_name.length === 0)
        errs[errs.length] = "نام خانوادگی نامعتبر است";

    if (!Common.isValidNumber(instId))
        errs[errs.length] = "درخواست نامعتبر است";

    if (!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if(email === undefined || email.length === 0)
        errs[errs.length] = "پست الکترونیک نامعتبر است";

    if (!Common.isValidNumber(phone) || phone.length !== 11)
        errs[errs.length] = "شماره همراه نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if (reqId === -1) {
                errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            }
            else {
                sequelize.query("insert into modiramel_forms (request_id, first_name, last_name, nid, phone, mail) values (?, ?, ?, ?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [reqId, first_name, last_name, nid, phone, email]
                }).then(tmp => {
                    res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/3/' + instId}));
                }).catch(x => {
                    sequelize.query("update modiramel_forms set first_name = ?, last_name = ?, nid = ?, phone = ?, mail = ? where request_id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [first_name, last_name, nid, phone, email, reqId]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/3/' + instId}));
                    });
                });
            }
        });
};

exports.submitHeyatModireForm = function (req, res) {

    let errs = [];

    let instId = req.body.instId;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let nid = req.body.nid;
    let role = req.body.role;
    let percent = req.body.percent;
    let id = req.body.id;

    if(first_name === undefined || first_name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if(last_name === undefined || last_name.length === 0)
        errs[errs.length] = "نام خانوادگی نامعتبر است";

    if(role === undefined || role.length === 0)
        errs[errs.length] = "سمت وارد شده نامعتبر است";

    if (!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if (!Common.isValidNumber(percent) || percent.length > 2)
        errs[errs.length] = "درصد سهام نامعتبر است";

    if (id !== "-1" && !Common.isValidNumber(id))
        errs[errs.length] = "درخواست نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            }
            else {

                if (parseInt(id) === -1) {

                    sequelize.query("insert into heyatmodire_forms (request_id, first_name, last_name, nid, role, percent) values (?, ?, ?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [reqId, first_name, last_name, nid, role, percent]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok'}));
                    });
                }

                else {

                    sequelize.query("select id from heyatmodire_forms where id = ?", {
                        type: Sequelize.QueryTypes.SELECT,
                        replacements: [id]
                    }).then(tmp => {

                        if (tmp == null || tmp.length === 0) {
                            errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                            res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
                        }
                        else {
                            sequelize.query("update heyatmodire_forms set first_name = ?, last_name = ?, nid = ?, role = ?, percent = ? where id = ?", {
                                type: Sequelize.QueryTypes.UPDATE,
                                replacements: [first_name, last_name, nid, role, percent, tmp[0].id]
                            }).then(tmp => {
                                res.send(JSON.stringify({'status': 'ok'}));
                            });
                        }
                    });

                }
            }
        });
};

exports.submitJavazForm = function (req, res) {

    let errs = [];

    let instId = req.body.instId;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let nid = req.body.nid;
    let id = req.body.id;

    if(first_name === undefined || first_name.length === 0)
        errs[errs.length] = "نام نامعتبر است";

    if(last_name === undefined || last_name.length === 0)
        errs[errs.length] = "نام خانوادگی نامعتبر است";

    if (!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        errs[errs.length] = "کد ملی نامعتبر است";

    if (id !== "-1" && !Common.isValidNumber(id))
        errs[errs.length] = "درخواست نامعتبر است";

    if(errs.length > 0) {
        res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
        return;
    }

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
            }
            else {
                if (parseInt(id) === -1) {
                    sequelize.query("insert into javaz_forms (request_id, first_name, last_name, nid) values (?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [reqId, first_name, last_name, nid]
                    }).then(tmp => {
                        res.send(JSON.stringify({'status': 'ok'}));
                    });
                }

                else {

                    sequelize.query("select id from javaz_forms where id = ?", {
                        type: Sequelize.QueryTypes.SELECT,
                        replacements: [id]
                    }).then(tmp => {

                        if (tmp == null || tmp.length === 0) {
                            errs[errs.length] = "عملیات مورد نظر غیر مجاز می باشد";
                            res.send(JSON.stringify({'status': 'nok', 'errs': errs}));
                        }
                        else {
                            sequelize.query("update javaz_forms set first_name = ?, last_name = ?, nid = ? where id = ?", {
                                type: Sequelize.QueryTypes.UPDATE,
                                replacements: [first_name, last_name, nid, tmp[0].id]
                            }).then(tmp => {
                                res.send(JSON.stringify({'status': 'ok'}));
                            });
                        }
                    });
                }
            }
        });
};

exports.removeHeyatModireForm = function(req, res) {

    let id = req.body.id;

    sequelize.query("select h.id from heyatmodire_forms h, requests r where r.id = h.request_id and h.id = ? and r.user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [id, req.session.user.id]
    }).then(tmp => {

        if(tmp === null || tmp.length === 0) {
            res.send("nok");
            return;
        }

        res.send("ok");
        HeyatModireForm.destroy({where: {id: tmp[0].id}});
    });

};

exports.removeJavazForm = function(req, res) {

    let id = req.body.id;

    sequelize.query("select j.id from javaz_forms j, requests r where r.id = j.request_id and r.user_id = ? and j.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id, id]
    }).then(tmp => {

        if(tmp === null || tmp.length[0]) {
            res.send("nok");
            return;
        }

        res.send("ok");

        JavazForm.destroy({where: {id: tmp[0].id}});
    });

};

function validatePrePostConstraint(ans, constraintMode, additional) {

    switch (constraintMode) {
        case 1:
            ans  = ans.split("/");
            if(ans[1].length === 1)
                ans[1] = "0" + ans[1];

            if(ans[2].length === 1)
                ans[2] = "0" + ans[2];

            ans = ans[0] + "" + ans[1] + "" + ans[2];
            ans = parseInt(ans);
            if(!Common.diffDayWithToday(ans, additional))
                return false;
            break;
        case 2:
            if(ans < additional)
                return false;
            break;
        case 3:
            if(ans.length < additional)
                return false;
            break;
        case 4:
            if(!Common.isValidNumber(ans) || ans.length < additional)
                return false;
            break;
        case 5:
            if(ans.length < 1 || ans.length > additional)
                return false;
            break;
        case 6:
            if(ans > additional)
                return false;
            break;
        case 9:
            if (!Common.isValidNumber(ans) || !Common.vmsNationalCode(ans))
                return false;
            break;
        case 10:
            if (ans !== "true")
                return false;
            break;
    }

    return true;
}

exports.submitInfoMadrak = function(req, res) {

    let instId = req.params.instId;
    let mode = req.params.mode;

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                return res.send(JSON.stringify({'status': 'nok', 'mode': mode, 'error': "عملیات مورد نظر غیر مجاز می باشد"}));
            }
            else {

                let form = new formidable.IncomingForm();
                form.parse(req);
                let date = new Date();
                let fileName;

                form.on('fileBegin', function (name, file) {

                    let arrTmp = file.name.split('.');
                    fileName = date.getTime() + "_" + parseInt(Math.random() * (999999 - 100000) + 100000) + "." + arrTmp[arrTmp.length - 1];

                    file.path = __dirname + "/../assets/storage/" + fileName;
                });

                form.on('file', function (name, file) {

                    if(file.size > 2000000) {
                        fs.unlinkSync(file.path);
                        return res.send(JSON.stringify({'status': 'nok', 'mode': mode, 'error': "حجم آپلود شده، بیش از حد مجاز است."}));
                    }

                    sequelize.query("select val_ from madareks where request_id = ? and key_ = ?", {
                        type: Sequelize.QueryTypes.SELECT,
                        replacements: [reqId, mode]
                    }).then(tmp => {

                        if(tmp == null || tmp.length === 0) {
                            sequelize.query("insert into madareks (request_id, key_, val_) values (?, ?, ?)", {
                                type: Sequelize.QueryTypes.INSERT,
                                replacements: [reqId, mode, fileName]
                            });
                        }
                        else {
                            fs.unlinkSync(__dirname + "/../assets/storage/" + tmp[0].val_);

                            sequelize.query("update madareks set val_ = ? where request_id = ? and key_ = ?", {
                                type: Sequelize.QueryTypes.UPDATE,
                                replacements: [fileName, reqId, mode]
                            });
                        }
                    });

                    res.send(JSON.stringify({'status': 'ok', 'mode': mode}));

                    console.log('Uploaded1 ' + file.name);
                });

            }
        });
};

exports.submitInfoMadrak2 = function(req, res) {

    let instId = req.params.instId;
    let mode = req.params.mode;
    let val = req.body.val;

    Promise.all([
        createNewRequest(instId, req.session.user.id)
    ])
        .then(function (result) {
            let reqId = result[0];
            if(reqId === -1) {
                return res.send(JSON.stringify({'status': 'nok', 'mode': mode, 'error': "عملیات مورد نظر غیر مجاز می باشد"}));
            }
            else {
                sequelize.query("insert into madareks (request_id, key_, val_) values (?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [reqId, mode, val]
                }).catch(x => {
                    sequelize.query("update madareks set val_ = ? where request_id = ? and key_ = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [val, reqId, mode]
                    });
                });

                res.send(JSON.stringify({'status': 'ok', 'mode': mode}));
            }
        });
};

exports.submitPreUserData = function (req, res) {

    let instId = req.body.instId;
    let mode = req.body.mode;
    let user_id = req.session.user.id;

    if(mode === "1") {

        sequelize.query("select * from preconditions where instruction_id = ? and type <> 5", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [instId]
        }).then(attrs => {

            if(attrs != null && attrs.length > 0) {

                let ans;
                let errors = [];

                for(let i = 0; i < attrs.length; i++) {
                    ans = req.body[attrs[i].id];

                    if (ans == null)
                        continue;

                    if(attrs[i].main_constraint != null) {
                        if (!validatePrePostConstraint(ans, attrs[i].main_constraint,
                            attrs[i].additional_constraint)) {
                            errors[errors.length] = attrs[i].error;
                        }
                    }
                }

                if(errors.length > 0) {
                    res.send(JSON.stringify({'status': 'nok', 'errs': errors}));
                    return;
                }

                Promise.all([createNewRequest(instId, req.session.user.id)]).then(result => {
                    if(result[0] === -1)
                        res.send(JSON.stringify({'status': 'nok', 'errs': ['درخواست شما نامعتبر است']}));
                    else {

                        for(let i = 0; i < attrs.length; i++) {

                            if(req.body[attrs[i].id] == null)
                                continue;

                            sequelize.query("insert into user_pre_ans (ans, attr_id, mode, user_id) values (?, ?, ?, ?)", {
                                type: Sequelize.QueryTypes.INSERT,
                                replacements: [req.body[attrs[i].id], attrs[i].id, true, user_id]
                            }).catch(x => {
                                sequelize.query("update user_pre_ans set ans = ? where mode = ? and attr_id = ? and user_id = ?", {
                                    type: Sequelize.QueryTypes.UPDATE,
                                    replacements: [req.body[attrs[i].id], true, attrs[i].id, user_id]
                                })
                            });
                        }

                        res.send(JSON.stringify({'status': 'ok', 'url': '/farayand/1/1/' + instId}, null, 4));
                    }
                });
            }

        });
    }
    else if (mode === "0") {

        sequelize.query("select * from pre_actors where instruction_id = ? and type <> 5", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [instId]
        }).then(attrs => {

            if(attrs != null && attrs.length > 0) {

                if(req.body[attrs[0].id] == 1) {
                    res.send(JSON.stringify({'status': 'ok', 'url': '/prefarayand/' + instId}, null, 4));
                    return;
                }

                let ans;
                let errors = [];

                for(let i = 0; i < attrs.length; i++) {

                    ans = req.body[attrs[i].id];

                    if(ans == null)
                        continue;

                    if(attrs[i].main_constraint != null) {
                        if (!validatePrePostConstraint(ans, attrs[i].main_constraint,
                            attrs[i].additional_constraint)) {
                            errors[errors.length] = attrs[i].error;
                        }
                    }
                }

                if(errors.length > 0) {
                    res.send(JSON.stringify({'status': 'nok', 'errs': errors}));
                    return;
                }

                for(let i = 0; i < attrs.length; i++) {
                    sequelize.query("insert into user_pre_ans (ans, attr_id, mode, user_id) values (?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [req.body[attrs[i].id], attrs[i].id, false, user_id]
                    }).catch(x => {
                        sequelize.query("update user_pre_ans set ans = ? where mode = ? and attr_id = ? and user_id = ?", {
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements: [req.body[attrs[i].id], false, attrs[i].id, user_id]
                        })
                    });
                }

                res.send(JSON.stringify({'status': 'ok', 'url': '/prefarayand/' + instId}, null, 4));
            }

        });
    }
    else {
        res.send(JSON.stringify({'status': 'nok', 'errs': ['لطفا همه موارد لازم را پر نمایید']}, null, 4));
    }

};

exports.submitPostUserData = function (req, res) {

    let instId = req.body.instId;
    let user_id = req.session.user.id;

    sequelize.query("select * from post_conditions where instruction_id = ? and type <> 5", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId]
    }).then(attrs => {

        if(attrs != null && attrs.length > 0) {

            let where = {};

            for(let i = 0; i < attrs.length; i++) {

                where = {'attr_id': attrs[i].id, 'user_id': user_id};
                let ans;
                let errors = [];

                for(let i = 0; i < attrs.length; i++) {

                    ans = req.body[attrs[i].id];

                    if(ans == null)
                        continue;

                    if(attrs[i].main_constraint != null) {
                        if (!validatePrePostConstraint(ans, attrs[i].main_constraint,
                            attrs[i].additional_constraint)) {
                            errors[errors.length] = attrs[i].error;
                        }
                    }
                }

                if(errors.length > 0) {
                    res.send(JSON.stringify({'status': 'nok', 'errs': errors}));
                    return;
                }

                sequelize.query("insert into user_post_ans (ans, attr_id, user_id) values (?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [req.body[attrs[i].id], attrs[i].id, user_id]
                }).catch(x => {
                    sequelize.query("update user_post_ans set ans = ? where attr_id = ? and user_id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [req.body[attrs[i].id], attrs[i].id, user_id]
                    });
                });
            }

            if(attrs.length > 0) {
                Promise.all([
                    createNewRequest(instId, req.session.user.id)
                ])
                    .then(function (result) {
                        let reqId = result[0];
                        if (reqId === -1) {
                            res.send(JSON.stringify({'status': 'nok', 'errs': ["عملیات مورد نظر غیر مجاز می باشد"]}));
                        }
                        else {
                            res.send(JSON.stringify({'status': 'ok', 'url': '/home'}, null, 4));
                        }
                    });
            }
            else
                res.send(JSON.stringify({'status': 'ok', 'url': '/home'}, null, 4));
        }
    });
};