
const Statistic = require("../models/Statistic");
const Request = require("../models/Request");
const RequestQueue = require("../models/RequestQueue");
const Users = require("../models/users");
const Common = require("../controllers/Common");
const Kargroh = require("../models/Kargroh");
const Instruction = require("../models/Instruction");
const State = require("../models/State");
const Block = require("../models/Block");
const BlockAccess = require("../models/BlockAccess");
const BlockKargrohState = require("../models/BlockKargrohState");

const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

exports.analytics = function(req, res) {

    sequelize.query("select count(*) as countNum from users where level = 1", {
        type: Sequelize.QueryTypes.SELECT
    }).then(tmp => {
        res.render('admin/adminAnalytics', {
            csrfToken: req.csrfToken(),
            'totalUsers': tmp[0].countNum
        });
    });
};

exports.getTotalRequests = function (req, res) {

    sequelize.query("select count(*) as countNum from requests",{
        type: Sequelize.QueryTypes.SELECT
    }).then(tmp => {
        res.send(JSON.stringify(tmp[0].countNum));
    });
};

exports.getTotalDoneRequests = function (req, res) {

    sequelize.query("select count(*) as countNum from request_queues",{
        type: Sequelize.QueryTypes.SELECT
    }).then(tmp => {
        res.send(JSON.stringify(tmp[0].countNum));
    });
};

exports.getTotalRequestsPerInstructions = function (req, res) {

    sequelize.query("SELECT count(*) as total_request, (SELECT count(*) from request_queues rq, requests r2 WHERE rq.request_id = r2.id and r2.instruction_id = i.id) as total_request_queue, i.name from requests r, instructions i where r.instruction_id = i.id GROUP BY (r.instruction_id)", {
        type: Sequelize.QueryTypes.SELECT
    }).then(tmp => {
        res.send(JSON.stringify(tmp, null, 4));
    }).catch(x => {
        res.send(JSON.stringify(x));
    });
};

exports.getTotalVisits = function (req, res) {

    let lastWeek = Common.getLast(7);
    sequelize.query('select sum(counter) as totalSum, date from statistics where date > ? group by (date)', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [lastWeek]
    }).then(tmp => {
        res.send(JSON.stringify(tmp, null, 4));
    });

};

exports.getVisitsPerURL = function (req, res) {

    let lastWeek = Common.getLast(7);
    sequelize.query('select sum(counter) as totalSum, url from statistics where date > ? group by url, date', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [lastWeek]
    }).then(tmp => {

        let arr = [];

        for (let i = 0; i < tmp.length; i++) {

            tmp[i].totalSum = parseInt(tmp[i].totalSum);
            let allow = true;

            for(let j = 0; j < arr.length; j++) {
                if(arr[j].url === tmp[i].url) {
                    arr[j].data[arr[j].data.length] = tmp[i].totalSum;
                    arr[j].total += tmp[i].totalSum;
                    allow = false;
                    break;
                }
            }

            if(allow)
                arr[arr.length] = {"url": tmp[i].url, "total": tmp[i].totalSum, "data": [tmp[i].totalSum]};
        }

        let out = [];
        let counter = 0;

        for(let i = 0; i < arr.length; i++) {
            if(arr[i].data.length > 1)
                out[counter++] = arr[i];
        }

        res.send(JSON.stringify(out, null, 4));
    });

};

exports.createNewKargroh = function(req, res) {

    Users.findAll({where: {level: 2}, attributes: ['first_name', 'last_name', 'id']}).then(users => {

        let out = [];
        let counter = 0;

        for(let i = 0; i < users.length; i++) {
            out[counter++] = users[i].dataValues;
        }

        res.render('admin/createNewKargroh', {
            csrfToken: req.csrfToken(),
            users: out,
            kargroh: "",
            members: []
        });

    });
};

exports.deleteKargroh = function(req, res) {

    sequelize.query("delete from kargrohs where name = ?", {
        type: Sequelize.QueryTypes.DELETE,
        replacements: [req.params.name]
    }).then(tmp => {
        res.redirect("/kargrohs");
    }).catch(tmp => {
        res.redirect("/kargrohs");
    });
};

exports.kargroh = function(req, res) {

    sequelize.query("select k.logger, concat(u.first_name, ' ', u.last_name) as username, k.id from kargrohs k, users u where k.user_id = u.id and k.name = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.params.name]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0)
            res.redirect("/");

        else {

            Users.findAll({where: {level: 2}, attributes: ['first_name', 'last_name', 'id']}).then(users => {

                let out = [];
                let counter = 0;

                for (let i = 0; i < users.length; i++) {
                    out[counter++] = users[i].dataValues;
                }

                res.render('admin/createNewKargroh', {
                    csrfToken: req.csrfToken(),
                    members: tmp,
                    kargroh: req.params.name,
                    users: out
                });
            });
        }
    });
};

exports.kargrohs = function(req, res) {

    sequelize.query("select distinct name from kargrohs", {
        type: Sequelize.QueryTypes.SELECT
    }).then(tmp => {
        res.render('admin/kargrohs', {
            'kargrohs': tmp
        });
    });
};

exports.addToKargroh = function(req, res) {

    sequelize.query("insert into kargrohs (name, user_id, logger) values (?, ?, ?)", {
        type: Sequelize.QueryTypes.INSERT,
        replacements: [req.body.kargroh, req.body.user_id, (req.body.logger === "on")]
    }).then(tmp => {
        res.send(JSON.stringify({'status': 'ok', 'id': tmp[0]}));
    }).catch(tmp => {
        res.send(JSON.stringify({'status': "nok"}));
    });
};

exports.updateKargroh = function(req, res) {
    sequelize.query("update kargrohs set name = ? where name = ?", {
        type: Sequelize.QueryTypes.UPDATE,
        replacements: [req.body.newName, req.body.oldName]
    });

    res.send(JSON.stringify("ok"));
};

exports.deleteMemberFromKargroh = function(req, res) {

    sequelize.query("delete from kargrohs where id = ?", {
        type: Sequelize.QueryTypes.DELETE,
        replacements: [req.body.id]
    }).then(tmp => {
        res.send(JSON.stringify("ok"));
    }).catch(tmp => {
        res.send(JSON.stringify("nok"));
    });

};

function getBlock(blockId) {

    if(parseInt(blockId) === -1)
        return "true";

    return sequelize.query("select * from blocks where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [blockId]
    }).then(tmp => {
        return (tmp == null || tmp.length === 0) ? false : tmp[0];
    })
}

function getInstruction(intsId) {
    return sequelize.query("select haghighi from instructions where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [intsId]
    }).then(tmp => {
        return (tmp == null || tmp.length === 0) ? false : tmp[0];
    })
}

exports.deleteStateKargroh = function(req, res) {

    let id = req.body.id;

    sequelize.query("delete from block_kargroh_states where id = ?", {
        type: Sequelize.QueryTypes.DELETE,
        replacements: [id]
    }).then(tmp => {
        res.send("ok");
    })
};

exports.blockCreator = function(req, res) {

    let instId = req.params.instId;
    let blockId = req.params.blockId;

    Promise.all([getBlock(blockId), getInstruction(instId)]).then(result => {

        if(!result[0] || !result[1]) {
            res.redirect('/');
            return;
        }

        sequelize.query("select distinct name from kargrohs", {
            type: Sequelize.QueryTypes.SELECT
        }).then(tmp => {

            State.findAll().then(states => {

                let outStates = [];
                let counter = 0;
                for(let i = 0; i < states.length; i++)
                    outStates[counter++] = states[i].dataValues;

                sequelize.query("select id, name from blocks where instruction_id = ?", {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: [instId]
                }).then(blocks => {

                    if(result[0] !== "true") {
                        sequelize.query("select b.id, s.name, b.kargroh from states s, block_kargroh_states b where s.id = b.state_id and b.block_id = ?", {
                            type: Sequelize.QueryTypes.SELECT,
                            replacements: [result[0].id]
                        }).then(stateKargrohs => {
                            res.render('admin/blockCreator', {
                                'kargrohs': tmp,
                                'states': states,
                                'blocks': blocks,
                                'stateKargrohs': stateKargrohs,
                                'hoghoghi': !result[1].haghighi,
                                'blockId': (result[0] === "true") ? -1 : result[0].id,
                                'block': (result[0] === "true") ? null : result[0],
                                'instId': instId,
                                'csrfToken': req.csrfToken()
                            });
                        })
                    }
                    else {
                        res.render('admin/blockCreator', {
                            'kargrohs': tmp,
                            'states': states,
                            'blocks': blocks,
                            'stateKargrohs': [],
                            'hoghoghi': !result[1].haghighi,
                            'blockId': (result[0] === "true") ? -1 : result[0].id,
                            'block': (result[0] === "true") ? null : result[0],
                            'instId': instId,
                            'csrfToken': req.csrfToken()
                        });
                    }
                });

            });
        });
    });
};

exports.accessOfBlock = function (req, res) {

    let blockId = req.body.blockId;
    let fields = req.body.fields;

    Promise.all([validateBlockId(blockId)]).then(result => {
        if(!result[0]) {
            res.send(404);
            return;
        }
        sequelize.query("delete from block_accesses where block_id = ?", {
            type: Sequelize.QueryTypes.DELETE,
            replacements: [blockId]
        }).then(tmp => {
            for(let i = 0; i < fields.length; i++) {
                sequelize.query("insert into block_accesses (block_id, form_id) values (?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [blockId, fields[i]]
                });
            }
            res.send(200);
        });
    });

};

function validateBlockId(blockId) {

    if(parseInt(blockId) === -1)
        return true;

    return sequelize.query("select id from blocks where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [blockId]
    }).then(tmp => {
        return (tmp != null && tmp.length > 0);
    })
}

function validateKargrohId(kargroh) {

    return sequelize.query("select id from kargrohs where name = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [kargroh]
    }).then(tmp => {
        return (tmp != null && tmp.length > 0);
    })
}

function validateInstructionId(intsId) {

    return sequelize.query("select id from instructions where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [intsId]
    }).then(tmp => {
        return (tmp != null && tmp.length > 0);
    })
}

exports.updateBlock = function(req, res) {

    let name = req.body.name;
    let prev = req.body.prev;
    let blockId = req.body.blockId;
    let initNotice = req.body.initNotice;
    let finalNotice = req.body.finalNotice;
    let duration = req.body.duration;
    let instId = req.body.instruction_id;
    let defaultKargroh = req.body.defaultKargroh;
    let errs = "";

    if(name === undefined || name.length === 0)
        errs += "لطفا نام بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";
    if(!Common.isValidNumber(duration))
        errs += "لطفا زمان بررسی بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";
    if(!Common.isValidNumber(initNotice))
        errs += "لطفا زمان اخطار اولیه بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";
    if(!Common.isValidNumber(finalNotice))
        errs += "لطفا زمان اخطار نهایی بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";

    Promise.all([
        validateBlockId(blockId),
        validateBlockId(prev),
        validateKargrohId(defaultKargroh),
        validateInstructionId(instId)
    ]).then(result => {

        if(!result[0] || !result[3])
            errs += "درخواست شما نامعتبر است" + "<br/>";
        if(!result[1])
            errs += "لطفا بلاک قبلی، بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";
        if(!result[2])
            errs += "لطفا کار گروه پیش فرض، بلاک مورد نظر خود را مشخص فرمایید" + "<br/>";

        if(errs.length === 0) {
            if(parseInt(blockId) === -1) {
                sequelize.query("insert into blocks (name, default_kargroh, instruction_id, duration, init_notice, final_notice, prev_block) values (?, ?, ?, ?, ?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [name, defaultKargroh, instId, duration, initNotice, finalNotice, prev]
                }).then(result => {
                    res.send(JSON.stringify({"status": "ok", "blockId": result[0]}));
                });
            }
            else {
                sequelize.query("update blocks set name = ?, default_kargroh = ?, duration = ?, init_notice = ?, final_notice = ?, prev_block = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [name, defaultKargroh, duration, initNotice, finalNotice, prev]
                }).then(result => {
                    res.send(JSON.stringify({"status": "ok"}));
                });
            }
        }
        else {
            res.send(JSON.stringify({"status": "nok", "errs": errs}));
        }
    });

};

exports.assignStateKargroh = function(req, res) {

    let states = req.body.states;
    let blockId = req.body.blockId;
    let kargroh = req.body.kargroh;

    Promise.all([validateBlockId(blockId), validateKargrohId(kargroh)]).then(result => {
        if(!result[0] || !result[1]) {
            res.send(404);
            return;
        }
        else {
            for(let i = 0; i < states.length; i++) {
                sequelize.query("insert into block_kargroh_states (block_id, kargroh, state_id) values (?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [blockId, kargroh, states[i]]
                });
            }
            res.send(JSON.stringify({"status": "ok"}));
        }
    });
};

exports.instructions = function (req, res) {
    Instruction.findAll({attributes: ['name', 'id', 'title']}).then(tmp => {

        if(tmp == null || tmp.length === 0) {
            res.send('/');
            return;
        }

        let out = [];
        let counter = 0;

        for(let i = 0; i < tmp.length; i++) {
            out[counter++] = tmp[i].dataValues;
        }

        res.render("admin/instructions", {
            'instructions': out
        });
    })
};

exports.registration = function (req, res) {

    State.findAll().then(states => {
        res.render('admin/memberRegistration', {
            'csrfToken': req.csrfToken(),
            'states': states
        });
    });
};

function checkPhone(phone) {

    if(!Common.isValidNumber(phone))
        return false;

    return sequelize.query("select id from users where phone_num = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [phone]
    }).then(result => {
        return !(result != null && result.length > 0);
    })
}

function checkMail(email) {
    return sequelize.query("select id from users where email = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [email]
    }).then(result => {
        return !(result != null && result.length > 0);
    })
}

function checkNid(nid) {

    if(!Common.isValidNumber(nid) || !Common.vmsNationalCode(nid))
        return false;

    return sequelize.query("select id from users where username = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [nid]
    }).then(result => {
        return !(result != null && result.length > 0);
    })
}

function checkName(first_name, last_name) {
    if(first_name === undefined || first_name.length === 0)
        return false;

    return !(last_name === undefined || last_name.length === 0);
}

exports.doRegistration = function (req, res) {

    let nid = req.body.nid;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;
    let password = req.body.password;
    let confirmPass = req.body.confirm_password;
    let email = req.body.email;
    let state = req.body.state;

    if(password !== confirmPass) {
        State.findAll().then(states => {
            res.render('admin/memberRegistration', {
                'csrfToken': req.csrfToken(),
                'states': states,
                'err': 'رمزعبور و تکرار آن یکی نیست'
            });
        });
    }

    Promise.all([
        checkPhone(phone),
        checkNid(nid),
        checkMail(email),
        Common.validPass(password),
        checkName(firstName, lastName),
    ]).then(result => {
        let err = "";
        if(!result[0])
            err += "شماره همراه وارد شده در سیستم موجود است" + "<br />";
        if(!result[1])
            err += "کد ملی وارد شده نامعتبر است (یا در سامانه موجود است)" + "<br />";
        if(!result[2])
            err += "ایمیل وارد شده در سامانه موجود است" + "<br />";
        if(!result[3])
            err += "رمزعبور وارد شده معتبر نمی باشد" + "<br />";
        if(!result[4])
            err += "نام و نام خانوادگی وارد شده معتبر نمی باشد" + "<br />";

        if(err.length > 0) {
            State.findAll().then(states => {
                res.render('admin/memberRegistration', {
                    'csrfToken': req.csrfToken(),
                    'states': states,
                    'err': err
                });
            });
        }
        else {
            sequelize.query("insert into users (first_name, last_name, username, phone_num, password, email, status, level, state) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", {
                type: Sequelize.QueryTypes.INSERT,
                replacements: [firstName, lastName, nid, phone, Common.getHashedPass(password), email, 3, 2, state]
            }).then(tmp => {
                res.redirect("/");
            });
        }
    })

};