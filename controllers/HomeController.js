const User = require('../models/users');
const State = require('../models/State');
const Cities = require('../models/Cities');
const Activation = require('../models/ActivationCode');
const Instruction = require('../models/Instruction');
const Common = require('../controllers/Common');
const { validationResult } = require('express-validator/check');
const Kavenegar = require('kavenegar');
const readXlsxFile = require('read-excel-file/node');
const Forms = require('../models/Forms');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});
const bcrypt = require('bcrypt');

exports.tmp = function(req, res) {

    Instruction.findAll().then(insts => {

        for (let i = 0; i < insts.length; i++) {

            if (insts[i].dataValues.haghighi === 1) {

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 1,
                    sub_step: 1,
                    mode: 4
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 2,
                    sub_step: 1,
                    mode: 7
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 3,
                    sub_step: 1,
                    mode: 9
                });
            }
            else {

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 1,
                    sub_step: 1,
                    mode: 1
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 1,
                    sub_step: 2,
                    mode: 2
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 1,
                    sub_step: 3,
                    mode: 3
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 1,
                    sub_step: 4,
                    mode: 4
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 2,
                    sub_step: 1,
                    mode: 5
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 2,
                    sub_step: 2,
                    mode: 6
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 2,
                    sub_step: 3,
                    mode: 7
                });

                Forms.create({
                    instruction_id: insts[i].dataValues.id,
                    step: 3,
                    sub_step: 1,
                    mode: 9
                });
            }

        }

    });

};

exports.readExcel2 = function (req, res) {
    readXlsxFile('controllers/cities.xlsx').then((rows) => {

        for (let i = 0; i < rows.length; i++) {

            let j = 0;

            Cities.create({
                id: rows[i][j++],
                name: rows[i][j++],
                state_id: rows[i][j++],
                populated: rows[i][j++]
            });

        }
    });
    res.send('successfully added');
};

exports.readExcel = function (req, res) {
    readXlsxFile('controllers/tmp.xlsx').then((rows) => {

        for (let i = 1; i < rows.length; i++) {

            let j = 0;

            Instruction.create({
                id: rows[i][j++],
                title: rows[i][j++],
                name: rows[i][j++],
                kasbokar: rows[i][j++],
                karafarini: rows[i][j++],
                eshteghal: rows[i][j++],
                sherakat: rows[i][j++],
                kind: rows[i][j++],
                duration: rows[i][j++],
                zamine: rows[i][j++],
                haghighi: rows[i][j++],
                shetabdahande: rows[i][j++],
                nopa: rows[i][j++],
                startup: rows[i][j++],
                fanavar: rows[i][j++],
                kharidar: rows[i][j++],
                sherkat: rows[i][j++],
                bahre_tehran: rows[i][j++],
                bahre_other: rows[i][j++],
                max_: rows[i][j++],
                karmozd: rows[i][j++],
                tanafos: rows[i][j++],
                bazpardakht: rows[i][j++],
                bazpardakht_total: rows[i][j++],
                payment_condition: rows[i][j++],
                payment_kind: rows[i][j++],
                activity_branch: rows[i][j++],
                parent: rows[i][j++],
                pic: rows[i][j++],
                bp: rows[i][j++],
                titr_1: rows[i][j++],
                desc_1: rows[i][j++],
                gam_1: rows[i][j++],
                desc_gam_1: rows[i][j++],
                gam_2: rows[i][j++],
                desc_gam_2: rows[i][j++],
                gam_3: rows[i][j++],
                desc_gam_3: rows[i][j++],
                gam_4: rows[i][j++],
                desc_gam_4: rows[i][j++],
                code: rows[i][j++],
                tedad_madarek: rows[i][j++],
                needed_info: rows[i][j++],
                needed_certificate: rows[i][j++],
                start: rows[i][j++],
                company: rows[i][j++],
                nopa_co: rows[i][j++],
                learner: rows[i][j++],
                teacher: rows[i][j++],
                employee: rows[i][j++],
                accs: rows[i][j++],
                vc: rows[i][j++],
                shahid: rows[i][j++],
                tavan: rows[i][j++],
                madad: rows[i][j++],
                notice: rows[i][j++],
                mablagh: rows[i][j++]
            });
        }
    });
    res.send('successfully added');
};

exports.retrievePassPage1 = function(req, res) {
    res.render('retrievePassPage1', {
        csrfToken: req.csrfToken(),
        my_nonce: req.nonce,
        err: req.params.err
    });
};

exports.forgetStep2 = function(req, res) {

    let userId = req.params.userId;

    sequelize.query("select sendTime from activations a, users u where u.phone_num = a.phone_num and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(users => {

        if(users != null && users.length > 0) {

            let activation = users[0];
            let reminder = parseInt((activation.sendTime - ((new Date).getTime()) + 300000) / 1000);

            res.render('retrievePassPage2', {
                csrfToken: req.csrfToken(),
                user_id: userId,
                reminder: reminder
            });
        }
        else
            res.redirect("/");
    });
};

exports.forget = function(req, res) {

    let nid = req.body.nid;

    sequelize.query("select id, phone_num from users where username = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [nid]
    }).then(user => {

        if(user != null && user.length > 0) {
            user = user[0];
            let out = parseInt(Math.random() * (999999 - 100000) + 100000);

            Activation.destroy({where: {phone_num: user.phone_num}});

            Activation.create({
                sendTime: (new Date).getTime(),
                phone_num: user.phone_num,
                code: out
            }).then(act => {
                sendSMS(out, user.phone_num);
                res.redirect("/forgetStep2/" + user.id);
            }).catch(x => {
                res.redirect("/retrievePassPage1/err");
            });
        }
        else {
            res.redirect("/retrievePassPage1/err");
        }
    });
};

exports.startRequestError = function(req, res) {
    res.render('startRequestError');
};

exports.news = function(req, res) {
    res.render('news', {
        login: (req.session && req.session.user)
    });
};

exports.termsAndConditions = function(req, res) {
    res.render('termsAndConditions');
};

exports.profileFaraynd = function(req, res) {
    res.render('profileFarayand');
};

exports.complaint = function(req, res) {
    res.render('complaint', {
        login: (req.session && req.session.user)
    });
};

exports.contactUs = function(req, res) {
    res.render('contactUs', {
        login: (req.session && req.session.user)
    });
};

exports.profile = function(req, res) {
    return sequelize.query("select i.id, i.name from requests r JOIN instructions i on r.instruction_id = i.id where r.user_id = ? order by r.createdAt DESC", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id]
    }).then(requests => {
        res.render('profile', {
            items: requests,
            nid: req.session.user.username,
            csrfToken: req.csrfToken()
        });
    });
};

exports.getMyPlans = function(req, res) {

    let instId = req.body.instId;

    return sequelize.query("select r.follow_code, r.createdAt as start, rq.createdAt, rq.supervisor_id, rq.percent from requests r left JOIN request_queues rq on r.id = rq.request_id where r.user_id = ? and r.instruction_id = ? order by r.createdAt DESC", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id, instId]
    }).then(requests => {

        let arr = [];

        if (requests != null && requests.length > 0) {

            for (let i = 0; i < requests.length; i++) {
                if (requests[i].percent != null) {

                    let date = Common.convertMiladyToJalali(requests[i].createdAt);
                    let complete = Common.addDate(date, 30);

                    arr[i] = {
                        'step': 'ارسال برای بررسی',
                        'kargroh': 'دبیرخانه وجوه اداره شده',
                        'percent': requests[i].percent,
                        'createdAt': date,
                        'code': requests[i].follow_code,
                        'name': requests[i].name,
                        'id': requests[i].id,
                        'complete': complete,
                        'reminder': Common.diffDateWithToday(complete) + " روز "
                    };
                }
                else {
                    let date = Common.convertMiladyToJalali(requests[i].start);
                    arr[i] = {
                        'step': 'در حال تکمیل',
                        'kargroh': 'ناموجود',
                        'percent': 'ناموجود',
                        'createdAt': date,
                        'code': requests[i].follow_code,
                        'name': requests[i].name,
                        'id': requests[i].id,
                        'complete': "ناموجود",
                        'reminder': "ناموجود"
                    };
                }
            }

        }

        res.send(JSON.stringify(arr, null, 4));
    });
};

exports.adminPage = function(req, res) {
    res.render('adminPage');
};

exports.requestsPage = function(req, res) {
    res.render('requestsPage');
};

exports.submitForgetCode = function(req, res){

    let code = req.body.code;
    let userId = req.body.userId;

    sequelize.query("select a.id from activations a, users u where code = ? and u.phone_num = a.phone_num and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [code, userId]
    }).then(tmp => {
        if (tmp != null && tmp.length > 0) {
            res.send(JSON.stringify({'status': "ok"}, null, 4));
        }
        else {
            res.send(JSON.stringify({'status': "nok"}, null, 4));
        }
    });
};

exports.retrievePassPage2 = function(req, res) {

    sequelize.query("select sendTime, phone_num from activations where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.params.id]
    }).then(act => {

        if(act != null && act.length > 0) {

            act = act[0];

            res.render('retrievePassPage2', {
                'reminder': parseInt((act.sendTime - ((new Date).getTime()) + 300000) / 1000),
                'phone_num': act.phone_num
            });
        }
        else
            res.redirect('/retrievePassPage1');
    });

};

exports.retrievePassPage3 = function(req, res) {
    res.render('retrievePassPage3');
};

exports.getSpecificInstructions = function(req, res) {

    let subMode = parseInt(req.body.subMode);
    let mode = parseInt(req.body.mode);

    let where = {};

    if (subMode !== -1) {
        switch (subMode) {
            case 1:
                where.start = 1;
                break;
            case 2:
                where.company = 1;
                break;
            case 3:
                where.nopa_co = 1;
                break;
            case 4:
                where.learner = 1;
                break;
            case 5:
                where.teacher = 1;
                break;
            case 6:
                where.employee = 1;
                break;
            case 7:
                where.accs = 1;
                break;
            case 8:
                where.vc = 1;
                break;
        }
    }

    if(mode !== -1) {

        switch (mode) {
            case 1:
                where.eshteghal = 1;
                break;
            case 2:
                where.karafarini = 1;
                break;
            case 3:
                where.kasbokar = 1;
                break;
            case 4:
                where.sherakat = 1;
                break;
        }

    }

    return Instruction
        .findAll({where: where})
        .then(spaces => {
            if (!spaces) {
                return res.status(404).send({
                    message: 'Space Not Found',
                });
            }

            let arr = [];

            for (let i = 0; i < spaces.length; i++) {
                arr[i] = spaces[i].dataValues;

                if(arr[i].haghighi)
                    arr[i].personality = "شخصیت های حقیقی";
                else
                    arr[i].personality = "شخصیت های حقوقی";

                arr[i].nerkh = Common.getNerkh(arr[i].bahre_tehran, arr[i].bahre_other, arr[i].karmozd);
            }

            res.send(JSON.stringify(arr, null, 4));
        })

        .catch(error => res.status(400).send(error));
};

exports.inst = function(req, res) {

    let inst_id = req.params.id;

    sequelize.query("select * from instructions where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [inst_id]
    }).then(instructions => {

        if(instructions != null && instructions.length > 0) {

            let inst = instructions[0];

            inst.nerkh = Common.getNerkh(inst.bahre_tehran, inst.bahre_other, inst.karmozd);

            if (inst.haghighi)
                inst.personality = "شخصیت های حقیقی";
            else
                inst.personality = "شخصیت های حقوقی";

            inst.pic = "/assets/img/" + inst.pic;

            return res.status(200).render('instruction', {
                inst: inst,
                login: (req.session && req.session.user)
            });
        }
        res.status(400).send("نتیجه ای یافت نشد");
    });
};

exports.retrieve = function(req, res) {

    return State
        .findAll()
        .then(spaces => {
            if (!spaces) {
                return res.status(404).send({
                    message: 'Space Not Found',
                });
            }

            let arr = [];

            for (let i = 0; i < spaces.length; i++) {
                arr[i] = spaces[i].dataValues;
            }

            res.render('main_page', {
                states: arr,
                csrfToken: req.csrfToken(),
                login: (req.session && req.session.user)
            });
        })
        .catch(error => res.status(400).send(error));
};

exports.signUp = function(req, res) {
    res.render('signUp', {
        csrfToken: req.csrfToken(),
        my_nonce: req.nonce,
        msg: req.params.msg
    });
};

exports.signUpStep2 = function (req, res) {

    let userId = req.params.user_id;

    sequelize.query("select sendTime from activations a, users u where u.phone_num = a.phone_num and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(users => {

        if(users != null && users.length > 0) {

            let activation = users[0];
            let reminder = parseInt((activation.sendTime - ((new Date).getTime()) + 300000) / 1000);

            res.render('signUpStep2', {
                csrfToken: req.csrfToken(),
                user_id: userId,
                reminder: reminder
            });
        }
        else
            res.redirect("/");
    });
};

function sendSMS(msg, receiver) {

    let api = Kavenegar.KavenegarApi({
        apikey: '4836666C696247676762504666386A336846366163773D3D'
    });

    api.VerifyLookup({
        receptor: receiver,
        token: msg,
        template: 'jobs'
    },
    function(response, status) {
        // console.log(response);
    });
}

exports.doSignUp = function(req, res) {

    let nid = req.body.nid;
    let phone_num = req.body.phone_num;

    sequelize.query("delete a from activations a inner join users u on a.phone_num = u.phone_num where u.status < 3 and TIMESTAMPDIFF(MINUTE, u.createdAt, CURRENT_TIMESTAMP) > 30", {
        type: Sequelize.QueryTypes.DELETE
    }).then(tmp => {
        sequelize.query("delete from users where status < 3 and TIMESTAMPDIFF(MINUTE, createdAt, CURRENT_TIMESTAMP) > 30", {
            type: Sequelize.QueryTypes.DELETE
        }).then(tmp => {
            sequelize.query("select id, phone_num from users where username = ? and phone_num = ? and status = 1", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [nid, phone_num]
            }).then(user => {

                if(user == null || user.length === 0) {

                    sequelize.query("insert into users (username, phone_num, password, status) values (?, ?, ?, ?)", {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [nid, phone_num, Common.getHashedPass("123456"), 1]
                    }).then(user => {

                        let out = parseInt(Math.random() * (999999 - 100000) + 100000);

                        Activation.create({
                            sendTime: (new Date).getTime(),
                            phone_num: phone_num,
                            code: out
                        });

                        sendSMS(out, phone_num);
                        res.redirect("/signupStep2/" + user[0]);
                    })
                        .catch(error => {
                            res.redirect('/signup/nok2');
                        });
                }

                else {
                    Activation.findOne({where:{phone_num: user[0].phone_num}}).then(act => {
                        if(act == null) {
                            let out = parseInt(Math.random() * (999999 - 100000) + 100000);

                            Activation.create({
                                sendTime: (new Date).getTime(),
                                phone_num: user[0].phone_num,
                                code: out
                            });
                            sendSMS(out, user[0].phone_num);
                            res.redirect("/signupStep2/" + user[0].id);
                        }
                        else {

                            if(act.sendTime >= (new Date).getTime() - 300000) {
                                res.redirect('/signup/nok3');
                                return;
                            }

                            sendSMS(act.code, user[0].phone_num);
                            res.redirect("/signupStep2/" + user[0].id);
                        }
                    });
                }
            });
        });
    });

    if(!Common.vmsNationalCode(nid)) {
        res.redirect('/signup/nok1');
        return;
    }

    if(!Common.isValidNumber(phone_num) || phone_num.length !== 11){
        res.redirect('/signup/nok5');
        return;
    }
};

exports.activeProfile = function(req, res) {

    let code = req.body.code;
    let userId = req.body.userId;

    sequelize.query("select a.id, a.phone_num from activations a, users u where code = ? and u.phone_num = a.phone_num and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [code, userId]
    }).then(act => {
        if(act != null && act.length > 0) {
            Activation.destroy({where: {id: act[0].id}});

            User.findOne({where: {'phone_num': act[0].phone_num}}).then(user => {
                if(user != null) {
                    user.update({'status': 2});
                }
            });
            res.send(JSON.stringify({'status': "ok"}, null, 4));
        }
        else {
            res.send(JSON.stringify({'status': "nok"}, null, 4));
        }
    });
};

exports.choosePass = function(req, res) {

    let email = req.body.email;
    let pass = req.body.password;
    let confirm_pass = req.body.confirm_password;
    let userId = req.body.userId;
    let ques = req.body.ques;

    if(ques.length === 0) {
        res.send(JSON.stringify({'status': 'nok3'}, null, 4));
        return;
    }

    if(pass !== confirm_pass) {
        res.send(JSON.stringify({'status': 'nok1'}, null, 4));
        return;
    }

    if(!Common.validPass(pass)) {
        res.send(JSON.stringify({'status': 'nok2'}, null, 4));
        return;
    }

    sequelize.query("select * from users where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(users => {

        if(users.length > 0) {

            let user = users[0];
            if(email !== -1)
                sequelize.query("update users set email = ?, ques = ?, password = ?, status = 3 where id = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [email, ques, Common.getHashedPass(pass), user.id]
                });
            else
                sequelize.query("update users set ques = ?, password = ?, status = 3 where id = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [ques, Common.getHashedPass(pass), user.id]
                });

            req.session.user = user;
            res.send(JSON.stringify({'status': 'ok'}, null, 4));
        }
    });

};

exports.changePass = function(req, res) {

    let pass = req.body.password;
    let confirm_pass = req.body.confirm_password;
    let userId = req.body.userId;
    let code = req.body.code;

    if(pass !== confirm_pass) {
        res.send(JSON.stringify({'status': 'nok1'}, null, 4));
        return;
    }

    if(!Common.validPass(pass)) {
        res.send(JSON.stringify({'status': 'nok2'}, null, 4));
        return;
    }

    sequelize.query("select u.id from activations a, users u where u.phone_num = a.phone_num and code = ? and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [code, userId]
    }).then(act => {
        if (act != null && act.length > 0) {

            act = act[0].id;
            sequelize.query("update users set password = ? where id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [Common.getHashedPass(pass), act]
            }).then(tmp => {
                res.send(JSON.stringify({'status': 'ok'}, null, 4));
            });
        }
        else {
            res.send(JSON.stringify({'status': 'nok3'}, null, 4));
        }
    });
};

exports.resendActivation = function(req, res) {

    let userId = req.body.userId;

    sequelize.query("select sendTime, code, a.id, a.phone_num from activations a, users u where u.phone_num = a.phone_num and u.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(users => {
        if(users != null && users.length > 0) {

            let activation = users[0];

            if(activation.sendTime >= (new Date).getTime() - 300000) {
                res.send(JSON.stringify({'status': 'nok', 'reminder': parseInt((activation.sendTime - ((new Date).getTime()) + 300000) / 1000)}, null, 4));
                return;
            }

            sendSMS(activation.code, activation.phone_num);

            sequelize.query("update activations set sendTime = ? where id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [(new Date()).getTime(), activation.id]
            });

            res.send(JSON.stringify({'status': 'ok', 'reminder': 300}, null, 4));
        }
        else {
            res.send(JSON.stringify({'status': 'nok'}, null, 4));
        }

    });
};

exports.getInstructionNames = function(req, res) {

    return Instruction
        .findAll({attributes: ['name', 'id']})
        .then(spaces => {
            if (!spaces) {
                return res.status(404).send({
                    message: 'Space Not Found',
                });
            }

            let arr = [];

            for (let i = 0; i < spaces.length; i++) {
                arr[i] = spaces[i].dataValues;
            }

            res.send(JSON.stringify(arr, null, 4));
        })

        .catch(error => res.status(400).send(error));
};

exports.getInstructions = function(req, res) {

    let kind_personality = parseInt(req.body.kind_personality);
    let activity_branch = parseInt(req.body.activity_branch);
    let stateId = parseInt(req.body.stateId);
    let parent = parseInt(req.body.parent);
    let facility = req.body.facility;
    let query = "select * from instructions where ";
    let replace = [];

    if (kind_personality !== -1) {
        if (kind_personality === 0)
            replace[0] = 1;
        else
            replace[0] = 0;
        query += "haghighi = ? and ";
    }

    let tehran = 1;

    if (stateId !== -1) {
        if (stateId !== 14)
            tehran = 0;
    }

    if(parent !== -1) {
        if (activity_branch !== -1) {
            query += "parent = ? and activity_branch = ? and ";
            replace[replace.length] = parent;
            replace[replace.length] = activity_branch;
        }
        else {
            query += "parent = ? and ";
            replace[replace.length] = parent;
        }
    }
    else {
        if (activity_branch !== -1) {
            query += "activity_branch = ? and ";
            replace[replace.length] = activity_branch;
        }
    }

    if(replace.length === 0)
        query += "1 = 1";
    else
        query = query.substr(0, query.length - 5);

    sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: replace
    }).then(arr => {

        if (!arr) {
            return res.status(404).send({
                message: 'Space Not Found',
            });
        }

        for (let i = 0; i < arr.length; i++) {

            arr[i].nerkh = (tehran === 1) ?
                (arr[i].bahre_tehran === 0) ? arr[i].karmozd : arr[i].bahre_tehran
                : (arr[i].bahre_other === 0) ? arr[i].karmozd : arr[i].bahre_other;

            arr[i].pardakht = arr[i].bazpardakht_total;

            if (facility !== -1) {

                switch (facility) {

                    case "shahid":
                    case "janbaz":
                    case "esar":
                    case "tavan":
                    case "madad":
                        arr[i].pardakht = arr[i].bazpardakht;
                        break;
                }
            }
        }

        res.send(JSON.stringify(arr, null, 4));
    });

};

exports.getCities = function(req, res) {

    sequelize.query('select * from cities where state_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.body.stateId]
    }).then(cities => {
        if (cities == null || cities.length === 0)
            return res.status(404).send({
                message: 'Space Not Found',
            });

        res.send(JSON.stringify(cities, null, 4));
    });
};

exports.getCities2 = function(req, res) {

    sequelize.query('select * from cities where populated = false and state_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.body.stateId]
    }).then(cities => {
        if (cities == null || cities.length === 0)
            return res.status(404).send({
                message: 'Space Not Found',
            });

        res.send(JSON.stringify(cities, null, 4));
    });
};

exports.getStates = function(req, res) {

    return State
        .findAll()
        .then(spaces => {
            if (!spaces) {
                return res.status(404).send({
                    message: 'Space Not Found',
                });
            }

            let arr = [];

            for (let i = 0; i < spaces.length; i++) {
                arr[i] = spaces[i].dataValues;
            }

            res.send(JSON.stringify(arr, null, 4));
        })

        .catch(error => res.status(400).send(error));
};

exports.doLogin = function(req, res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {

        const username = req.body.username,
            password = req.body.password;

        sequelize.query("select * from users where status > 2 and username = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [username]
        }).then(user => {
            if(user == null || user.length === 0)
                res.redirect('/login/err');
            else if(!bcrypt.compareSync(password, user[0].password))
                res.redirect('/login/err');
            else {
                req.session.user = user[0];
                res.redirect('/');
            }

        });
    }
};

exports.setting = function (req, res) {
    res.render('profileSetting');
};