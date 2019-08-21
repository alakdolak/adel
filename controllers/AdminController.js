
const Statistic = require("../models/Statistic");
const Request = require("../models/Request");
const RequestQueue = require("../models/RequestQueue");
const Users = require("../models/users");
const City = require("../models/Cities");
const Common = require("../controllers/Common");
const Kargroh = require("../models/Kargroh");
const Instruction = require("../models/Instruction");
const State = require("../models/State");
const Block = require("../models/Block");
const HoghoghiForm = require("../models/HoghoghiForm");
const BlockAccess = require("../models/BlockAccess");
const BlockKargrohState = require("../models/BlockKargrohState");
const ResponsibilitiesHistory = require("../models/ResponsibilitiesHistory");
const Promise = require('bluebird');

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

exports.insts = function (req, res) {

    Instruction.findAll({attributes: ["id", "name", "title"]}).then(tmp => {

        let out = [];
        let counter = 0;

        for(let i = 0; i < tmp.length; i++) {
            out[counter++] = tmp[i].dataValues;
        }

        res.render("admin/insts", {
            "insts": out
        });
    });
};

exports.blocks = function (req, res) {

    sequelize.query("select id, name, default_kargroh, duration from blocks where instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.params.instId]
    }).then(tmp => {
        res.render("admin/blocks", {
            blocks: tmp,
            instId: req.params.instId
        });
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

            sequelize.query("select form_id from block_accesses where block_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [blockId]
            }).then(blockAccesses => {

                let blockAccessesArr = [];
                for(let i = 0; i < blockAccesses.length; i++) {
                    blockAccessesArr[i] = blockAccesses[i].form_id;
                }

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
                                    'blockAccesses': blockAccessesArr,
                                    'csrfToken': req.csrfToken()
                                });
                            })
                        }
                        else {
                            res.render('admin/blockCreator', {
                                'kargrohs': tmp,
                                'states': states,
                                'blocks': blocks,
                                'blockAccesses': blockAccessesArr,
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
            res.send(JSON.stringify("ok"));
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
                sequelize.query("update blocks set name = ?, default_kargroh = ?, duration = ?, init_notice = ?, final_notice = ?, prev_block = ? WHERE id = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [name, defaultKargroh, duration, initNotice, finalNotice, prev, blockId]
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

exports.myPlans = function (req, res) {

    let userId = req.session.user.id;

    userId = 199;

    sequelize.query("select b.id as block_id, r.id as reqId, follow_code, b.duration, b.name, username, phone_num, i.name as instName, rq.id, r.createdAt as send_date, rh.createdAt as accept_date from " +
        "blocks b, responsibilities_histories rh, request_queues rq, requests r, instructions i, users u where " +
        "b.id = rh.block_id and rq.request_id = r.id and rh.description is null " +
        "and rq.supervisor_id = rh.supervisor_id and rh.request_id = r.id and rq.supervisor_id = ? and r.instruction_id = i.id and r.user_id = u.id", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(result => {

        for(let i = 0; i < result.length; i++) {
            result[i].send_date = Common.convertMiladyToJalali(result[i].send_date);
            result[i].accept_date = Common.convertMiladyToJalali(result[i].accept_date);
            result[i].reminder = result[i].duration - Common.diffDateWithToday(result[i].accept_date);
        }

        res.render('admin/myPlans', {
            csrfToken: req.csrfToken(),
            plans: result
        });

    });

};

exports.hasPrevRequest = function(req, res) {

    let userId = req.body.userId;

    sequelize.query("select rq.id from request_queues rq, requests r where r.id = request_id and " +
        "rq.step = 200 and user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(hasPrevReq => {
        return res.send(JSON.stringify({"status": (hasPrevReq != null && hasPrevReq.length > 0)}));
    });
};

exports.requestedMoney = function(req, res) {

    let userId = req.body.userId;
    let instId = req.body.instId;

    sequelize.query("select u.ans, p.options from user_pre_ans u, preconditions p where label = 'نوع تسهیلات ' and p.id = u.attr_id " +
        "and p.instruction_id = ? and u.user_id = ? and mode = 1 and p.options is not null", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId, userId]
    }).then(tmp => {

        let ans = "نامشخص";
        if(tmp != null && tmp.length > 0) {
            ans = tmp[0].ans;
            let options = tmp[0].options.split("@");

            for (let i = 0; i < options.length; i++) {
                options[i] = options[i].split('_');
                if (ans == options[i][0]) {
                    ans = options[i][1];
                    break;
                }
            }
        }

        sequelize.query("select max_ from instructions where id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [instId]
        }).then(tmp2 => {
            res.send(JSON.stringify({"requestedMoney": ans, "max": tmp2[0].max_}));
        });
    });
};

exports.requesterName = function(req, res) {

    let haghighi = req.body.haghighi;
    let reqId = req.body.reqId;

    if(haghighi == 1) {
        sequelize.query("select concat(first_name, ' ', last_name) as name from haghighi_forms where request_id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [reqId]
        }).then(tmp => {
            return res.send(JSON.stringify({"result": tmp[0].name}));
        });
    }

    else {
        sequelize.query("select name from hoghoghi_forms where request_id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [reqId]
        }).then(tmp => {
            return res.send(JSON.stringify({"result": tmp[0].name}));
        });
    }

};

exports.requestModiramelName = function(req, res) {

    let reqId = req.body.reqId;

    sequelize.query("select concat(first_name, ' ', last_name) as name from modiramel_forms where request_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId]
    }).then(tmp => {
        return res.send(JSON.stringify({"result": tmp[0].name}));
    });
};

exports.requestNamayandeName = function(req, res) {

    let reqId = req.body.reqId;

    sequelize.query("select concat(first_name, ' ', last_name) as name from namayande_forms where request_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId]
    }).then(tmp => {
        return res.send(JSON.stringify({"result": tmp[0].name}));
    });

};

exports.others = function(req, res) {

    let haghighi = req.body.haghighi;
    let reqId = req.body.reqId;

    if(haghighi == 1) {
    }
    else {
        sequelize.query("select first_name, last_name, nid, role, percent from heyatmodire_forms where request_id = ?", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [reqId]
        }).then(results => {

            for(let i = 0; i < results.length; i++) {
                switch (parseInt(results[i].role)) {
                    case 1:
                        results[i].role = "رئیس هیئت مدیره";
                        break;
                    case 2:
                        results[i].role = "مدیر عامل و عضو هیئت مدیره";
                        break;
                    case 3:
                        results[i].role = "عضو هیئت مدیره";
                        break;
                    case 4:
                        results[i].role = "نایب رئیس هیئت مدیره";
                        break;
                    case 5:
                        results[i].role = "سایر";
                        break;
                }
            }

            res.send(JSON.stringify(results));
        });
    }

};

function acceptFormField(formId, reqId, instId, userId, fieldId) {

    switch (formId) {
        case -2:
            break;
        case -1:
            break;
        case 0:
            return sequelize.query("select p.id from preconditions p, user_pre_ans u where " +
                "p.instruction_id = ? and u.attr_id = p.id and u.id = ? and u.user_id = ? and u.mode = 1", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [instId, fieldId, userId]
            }).then(tmp => {

                if(tmp != null && tmp.length > 0) {

                    return sequelize.query("update user_pre_ans set status = 1 where id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [fieldId]
                    }).then(tmp => {
                        return true;
                    }).catch(x => {
                        return false;
                    });
                }
                else {
                    return false;
                }
            });
        case 1:
            return sequelize.query("update hoghoghi_forms set " + fieldId + "_status = 1 where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 2:
            return sequelize.query("update modiramel_forms set " + fieldId + "_status = 1 where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 3:
            break;
        case 4:
            return sequelize.query("update namayande_forms set " + fieldId + "_status = 1 where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 5:
            return sequelize.query("select r.id from madareks m, requests r where request_id = r.id and m.id = ?" +
                " and r.user_id = ? and r.id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [fieldId, userId, reqId]
            }).then(tmp => {
                return sequelize.query("update madareks set status = 1 where id = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [fieldId]
                }).then(tmp => {
                    return (tmp[1] == 1);
                }).catch(x => {
                    return false;
                });
            });
        case 8:
            break;
    }

}

function rejectFormField(formId, reqId, instId, userId, fieldId, errLog) {

    switch (formId) {
        case -2:
            break;
        case -1:
            break;
        case 0:
            return sequelize.query("select p.id from preconditions p, user_pre_ans u where " +
                "p.instruction_id = ? and u.attr_id = p.id and u.id = ? and u.user_id = ? and u.mode = 1", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [instId, fieldId, userId]
            }).then(tmp => {

                if(tmp != null && tmp.length > 0) {

                    return sequelize.query("update user_pre_ans set status = 1 where id = ?", {
                        type: Sequelize.QueryTypes.UPDATE,
                        replacements: [fieldId]
                    }).then(tmp => {
                        return true;
                    }).catch(x => {
                        return false;
                    });
                }
                else {
                    return false;
                }
            });
        case 1:
            return sequelize.query("update hoghoghi_forms set " + fieldId + "_status = -1, " + fieldId + "_err_log = ? where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [errLog + "__" + Common.getFormattedToday2() + "__" + userId, reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 2:
            return sequelize.query("update modiramel_forms set " + fieldId + "_status = -1, " + fieldId + "_err_log = ? where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [errLog + "__" + Common.getFormattedToday2() + "__" + userId, reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 3:
            break;
        case 4:
            return sequelize.query("update namayande_forms set " + fieldId + "_status = -1, " + fieldId + "_err_log = ? where request_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [errLog + "__" + Common.getFormattedToday2() + "__" + userId, reqId]
            }).then(tmp => {
                return (tmp[1] == 1);
            }).catch(x => {
                return false;
            });
        case 5:
            return sequelize.query("select r.id from madareks m, requests r where request_id = r.id and m.id = ?" +
                " and r.user_id = ? and r.id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [fieldId, userId, reqId]
            }).then(tmp => {
                return sequelize.query("update madareks set status = -1, err_log = concat(err_log, '$$', ?) where id = ?", {
                    type: Sequelize.QueryTypes.UPDATE,
                    replacements: [errLog + "__" + Common.getFormattedToday2() + "__" + userId, fieldId]
                }).then(tmp => {
                    return (tmp[1] == 1);
                }).catch(x => {
                    return false;
                });
            });
        case 8:
            break;
    }

}

exports.acceptField = function (req, res) {

    let reqId = req.body.reqId;
    let formId = req.body.formId;
    let fieldId = req.body.fieldId;

    let userId = req.session.user.id;
    userId = 199;

    let userUserId = -1;
    let instructionId = -1;

    sequelize.query("select rq.step, r.instruction_id, r.user_id from request_queues rq, requests r where r.id = ? and r.id = request_id and " +
        "supervisor_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId, userId]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0)
            return res.sendStatus(403);

        tmp = tmp[0];
        instructionId = tmp.instruction_id;
        userUserId = tmp.user_id;

        let wantedStep = parseInt(tmp.step);

        Block.findAll({where: {instruction_id: instructionId}, attributes: ['id']}).then(blocks => {

            let blockIds = [];

            for(let i = 0; i < blocks.length; i++)
                blockIds.push(blocks[i].dataValues.id);

            let steps = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    steps.push(tmp[0]);
                });
            }).then(tmp => {

                let wantedBlockId = -1;

                for(let i = 0; i < steps.length; i++) {
                    if(steps[i] === wantedStep) {
                        wantedBlockId = i;
                        break;
                    }
                }

                if(wantedBlockId === -1)
                    return res.sendStatus(403);

                BlockAccess.count({where: {block_id: wantedBlockId, form_id: formId}}).then(accesses => {

                    if(accesses === 0)
                        return res.sendStatus(403);

                    Promise.all([acceptFormField(parseInt(formId), reqId, instructionId, userUserId, fieldId)]).then(tmp => {
                        if(tmp[0])
                            return res.send(JSON.stringify({"status": "ok"}));
                        else
                            return res.send(JSON.stringify({"status": "nok"}));
                    });
                });
            });
        });
    })
};

exports.rejectField = function (req, res) {

    let reqId = req.body.reqId;
    let formId = req.body.formId;
    let fieldId = req.body.fieldId;
    let errLog = req.body.errLog;

    if(errLog == null || errLog === undefined || errLog.length === 0)
        return res.send(JSON.stringify({"status": "nok2"}));

    let userId = req.session.user.id;
    userId = 199;

    let userUserId = -1;
    let instructionId = -1;

    sequelize.query("select rq.step, r.instruction_id, r.user_id from request_queues rq, requests r where r.id = ? and r.id = request_id and " +
        "supervisor_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId, userId]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0)
            return res.sendStatus(403);

        tmp = tmp[0];
        instructionId = tmp.instruction_id;
        userUserId = tmp.user_id;

        let wantedStep = parseInt(tmp.step);

        Block.findAll({where: {instruction_id: instructionId}, attributes: ['id']}).then(blocks => {

            let blockIds = [];

            for(let i = 0; i < blocks.length; i++)
                blockIds.push(blocks[i].dataValues.id);

            let steps = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    steps.push(tmp[0]);
                });
            }).then(tmp => {

                let wantedBlockId = -1;

                for(let i = 0; i < steps.length; i++) {
                    if(steps[i] === wantedStep) {
                        wantedBlockId = i;
                        break;
                    }
                }

                if(wantedBlockId === -1)
                    return res.sendStatus(403);

                BlockAccess.count({where: {block_id: wantedBlockId, form_id: formId}}).then(accesses => {

                    if(accesses === 0)
                        return res.sendStatus(403);

                    Promise.all([rejectFormField(parseInt(formId), reqId, instructionId, userUserId, fieldId, errLog)]).then(tmp => {
                        if(tmp[0])
                            return res.send(JSON.stringify({"status": "ok"}));
                        else
                            return res.send(JSON.stringify({"status": "nok"}));
                    });
                });
            });
        });
    })
};

function getData(formId, reqId, userId, instId){

    switch (formId) {
        case -2:
            break;
        case -1:
            return sequelize.query("select p.label, u.ans, p.options, u.status from pre_actors p, user_pre_ans u where p.instruction_id = ? and p.id = u.attr_id and u.mode = 0 and u.user_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [instId, userId]
            }).then(tmp => {
                if(tmp != null) {

                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp[i].options != null) {

                            let options = tmp[i].options.split("@");
                            let ans = tmp[i].ans;

                            for (let i = 0; i < options.length; i++) {
                                options[i] = options[i].split('_');
                                if (ans == options[i][0]) {
                                    ans = options[i][1];
                                    break;
                                }
                            }

                            tmp[i].ans = ans;
                        }
                    }

                    return tmp;
                }
                else {
                    return [];
                }
            });
        case 0:
            return sequelize.query("select u.id, p.label, u.ans, p.options, u.status from preconditions p, user_pre_ans u where " +
                "p.type <> 1 and p.type <> 5 and p.type <> 8 and p.type <> 9 and p.instruction_id = ? and p.id = u.attr_id and u.mode = 1 and u.user_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [instId, userId]
            }).then(tmp => {

                if(tmp != null && tmp.length > 0) {

                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp[i].options != null) {

                            let options = tmp[i].options.split("@");
                            let ans = tmp[i].ans;

                            for (let i = 0; i < options.length; i++) {
                                options[i] = options[i].split('_');
                                if (ans == options[i][0]) {
                                    ans = options[i][1];
                                    break;
                                }
                            }

                            tmp[i].ans = ans;
                        }
                    }

                    return tmp;
                }
                else {
                    return [];
                }
            });
        case 1:
            return sequelize.query("select * from hoghoghi_forms where request_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [reqId]
            }).then(form => {

                if(form != null && form.length > 0) {

                    form = form[0];

                    let ans = [];

                    switch (parseInt(form.company_kind)) {
                        case 1:
                            form.company_kind = "مسئولیت محدود";
                            break;
                        case 2:
                            form.company_kind = "سهامی خاص";
                            break;
                        case 3:
                            form.company_kind = "سهامی عام";
                            break;
                        case 4:
                            form.company_kind = "موسسه";
                            break;
                        case 5:
                            form.company_kind = "تعاونی";
                            break;
                        case 6:
                            form.company_kind = "سایر";
                            break;
                    }

                    return City.findOne({where: {id: form.city_id}, attributes: ['name']}).then(city => {
                        ans.push({"id": "name","file": false, "label": "نام کامل حقوقی", "ans": form.name, "status": form.name_status});
                        ans.push({"id": "company_kind", "file": false, "label": "نوع شرکت", "ans": form.company_kind, "status": form.company_kind_status});
                        ans.push({"id": "company_no", "file": false, "label": "شماره ثبت شرکت", "ans": form.company_no, "status": form.company_no_status});
                        ans.push({"id": "submit_date", "file": false, "label": "تاریخ ثبت شرکت", "ans": Common.convertDateToString(form.submit_date), "status": form.submit_date_status});
                        ans.push({"id": "nid", "file": false, "label": "شناسه ملی شرکت", "ans": form.nid, "status": form.nid_status});
                        ans.push({"id": "economy_code", "file": false, "label": "کد اقتصادی", "ans": form.economy_code, "status": form.economy_code_status});
                        ans.push({"id": "city_id", "file": false, "label": "شهر", "ans": city.dataValues.name, "status": form.city_id_status});
                        ans.push({"id": "address", "file": false, "label": "آدرس", "ans": form.address, "status": form.address_status});
                        ans.push({"id": "post_code", "file": false, "label": "کد پستی", "ans": form.post_code, "status": form.post_code_status});
                        ans.push({"id": "tel", "file": false, "label": "تلفن", "ans": form.tel, "status": form.tel_status});
                        ans.push({"id": "namabar", "file": false, "label": "نمابر", "ans": form.namabar, "status": form.namabar_status});
                        ans.push({"id": "mail", "file": false, "label": "ایمیل", "ans": form.mail, "status": form.mail_status});
                        ans.push({"id": "site", "file": false, "label": "وب سایت", "ans": form.site, "status": form.site_status});
                        ans.push({"id": "pre_tel", "file": false, "label": "پیش شماره", "ans": form.pre_tel, "status": form.pre_tel_status});
                        ans.push({"id": "pre_namabar", "file": false, "label": "پیش شماره نمابر", "ans": form.pre_namabar, "status": form.pre_namabar_status});
                        return ans;
                    });

                }
                else {
                    return [];
                }

            });
        case 2:
            return sequelize.query("select * from modiramel_forms where request_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [reqId]
            }).then(form => {

                if (form != null && form.length > 0) {

                    form = form[0];

                    let ans = [];
                    ans.push({"id": "first_name", "file": false, "label": "نام", "ans": form.first_name, "status": form.first_name_status});
                    ans.push({"id": "last_name", "file": false, "label": "نام خانوادگی", "ans": form.last_name, "status": form.last_name_status});
                    ans.push({"id": "nid", "file": false, "label": "کد ملی", "ans": form.nid, "status": form.nid_status});
                    ans.push({"id": "mail", "file": false, "label": "ایمیل", "ans": form.mail, "status": form.mail_status});
                    ans.push({"id": "phone", "file": false, "label": "شماره همراه", "ans": form.phone, "status": form.phone_status});
                    return ans;
                }
                else {
                    return [];
                }
            });
        case 3:
            return;
        case 4:
            return sequelize.query("select * from namayande_forms where request_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [reqId]
            }).then(form => {

                if (form != null && form.length > 0) {

                    form = form[0];

                    let ans = [];
                    ans.push({"id": "first_name", "file": false, "label": "نام", "ans": form.first_name, "status": form.first_name_status});
                    ans.push({"id": "last_name", "file": false, "label": "نام خانوادگی", "ans": form.last_name, "status": form.last_name_status});
                    ans.push({"id": "nid", "file": false, "label": "کد ملی", "ans": form.nid, "status": form.nid_status});
                    ans.push({"id": "mail", "file": false, "label": "ایمیل", "ans": form.mail, "status": form.mail_status});
                    ans.push({"id": "phone", "file": false, "label": "شماره همراه", "ans": form.phone, "status": form.phone_status});
                    return ans;
                }
                else {
                    return [];
                }
            });
        case 5:
            return sequelize.query("select * from madareks where request_id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [reqId]
            }).then(form => {

                if (form != null && form.length > 0) {

                    let ans = [];

                    for(let i = 0; i < form.length; i++) {
                        switch (form[i].key_) {
                            case "workHouseCode":
                                form[i].key_ = "کد کارگاه";
                                break;
                            case "companyAsasname":
                                form[i].key_ = "اساسنامه شرکت";
                                break;
                            case "companyProposal":
                                form[i].key_ = "رزومه شرکت";
                                break;
                            case "lastAddress":
                                form[i].key_ = "آخرین آدرس شرکت";
                                break;
                            case "lastInsuranceList":
                                form[i].key_ = "آخرین لیست بیمه";
                                break;
                            case "companyBirthAnnouncement":
                                form[i].key_ = "پیوست آگهی تاسیس روزنامه رسمی شرکت";
                                break;
                            case "companyLastChanges":
                                form[i].key_ = "پیوست آخرین تغییرات روزنامه رسمی شرکت";
                                break
                        }

                        if(form[i].err_log != null) {
                            let history = form[i].err_log.split("$$");
                            let histories = [];
                            for(let k = 0; k < history.length; k++) {
                                let splited = history[k].split("__");
                                if(history.length === 0 || splited.length !== 3)
                                    continue;
                                histories.push({"userId": splited[2], "date": splited[1], "text": splited[0]});
                            }
                            form[i].history = histories;
                        }
                        else
                            form[i].history = [];

                        if(form[i].key_ === "کد کارگاه")
                            ans.push({"id": form[i].id, "label": form[i].key_, "ans": form[i].val_,
                                "status": form.status, "file": false, "history": form[i].history});
                        else {

                            let ext = form[i].val_.split(".");
                            ext = ext[ext.length - 1];

                            ans.push({
                                "id": form[i].id,
                                "label": form[i].key_,
                                "ans": "/assets/storage/" + form[i].val_,
                                "status": form[i].status,
                                "file": true,
                                "ext": ext,
                                "history": form[i].history
                            });
                        }
                    }
                    return ans;
                }
                else {
                    return [];
                }
            });

        case 8:
            break;
    }
}

exports.getFormData = function(req, res) {

    let reqId = req.body.reqId;
    let formId = req.body.formId;

    let userId = req.session.user.id;
    userId = 199;
    let userUserId = -1;
    let instructionId = -1;


    sequelize.query("select rq.step, r.instruction_id, r.user_id from request_queues rq, requests r where r.id = ? and r.id = request_id and " +
        "supervisor_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId, userId]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0)
            return res.sendStatus(403);

        tmp = tmp[0];
        userUserId = tmp.user_id;
        instructionId = tmp.instruction_id;

        let wantedStep = parseInt(tmp.step);

        Block.findAll({where: {instruction_id: instructionId}, attributes: ['id']}).then(blocks => {

            let blockIds = [];

            for(let i = 0; i < blocks.length; i++)
                blockIds.push(blocks[i].dataValues.id);

            let steps = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    steps.push(tmp[0]);
                });
            }).then(tmp => {

                let wantedBlockId = -1;

                for(let i = 0; i < steps.length; i++) {
                    if(steps[i] === wantedStep) {
                        wantedBlockId = i;
                        break;
                    }
                }

                if(wantedBlockId === -1)
                    return res.sendStatus(403);

                BlockAccess.count({where: {block_id: wantedBlockId, form_id: formId}}).then(accesses => {

                    if(accesses === 0)
                        return res.sendStatus(403);

                    Promise.all([getData(parseInt(formId), reqId, userUserId, instructionId)]).then(tmp => {
                        return res.send(JSON.stringify(tmp[0]));
                    });
                });
            });
        });
    })

};

exports.getPreConditionsField = function(req, res) {

    let userId = req.body.userId;
    let instId = req.body.instId;

    sequelize.query("select p.label, u.ans, p.options from preconditions p, user_pre_ans u where " +
        "p.type <> 1 and p.type <> 5 and p.type <> 8 and p.type <> 9 and p.instruction_id = ? and p.id = u.attr_id and u.mode = 1 and u.user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId, userId]
    }).then(tmp => {

        if(tmp != null) {

            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].options != null) {

                    let options = tmp[i].options.split("@");
                    let ans = tmp[i].ans;

                    for (let i = 0; i < options.length; i++) {
                        options[i] = options[i].split('_');
                        if (ans == options[i][0]) {
                            ans = options[i][1];
                            break;
                        }
                    }

                    tmp[i].ans = ans;
                }
            }

            return res.send(JSON.stringify(tmp));
        }
        else {
            return res.send(JSON.stringify([]));
        }
    });
};

exports.getPreActorFields = function(req, res) {

    let userId = req.body.userId;
    let instId = req.body.instId;

    sequelize.query("select p.label, u.ans, p.options from pre_actors p, user_pre_ans u where p.instruction_id = ? and p.id = u.attr_id and u.mode = 0 and u.user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId, userId]
    }).then(tmp => {

        if(tmp != null) {

            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].options != null) {

                    let options = tmp[i].options.split("@");
                    let ans = tmp[i].ans;

                    for (let i = 0; i < options.length; i++) {
                        options[i] = options[i].split('_');
                        if (ans == options[i][0]) {
                            ans = options[i][1];
                            break;
                        }
                    }

                    tmp[i].ans = ans;
                }
            }

            return res.send(JSON.stringify(tmp));
        }
        else {
            return res.send(JSON.stringify([]));
        }
    });
};

exports.hasPreActor = function(req, res) {

    let userId = req.body.userId;
    let instId = req.body.instId;

    sequelize.query("select u.id from user_pre_ans u, pre_actors p where p.instruction_id = ? and mode = 0 and u.attr_id = p.id and user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId, userId]
    }).then(hasPreActor => {
        return res.send(JSON.stringify({"status": (hasPreActor != null && hasPreActor.length > 0)}));
    });

};

exports.showContentOfBlock = function(req, res) {

    let rqId = req.params.rqId;
    let userId = req.session.user.id;

    userId = 199;

    sequelize.query("select (SELECT u.ans from user_pre_ans u, preconditions p " +
        " WHERE p.instruction_id = r.instruction_id and p.label = 'نام استان' and u.user_id = r.user_id and" +
        " u.attr_id = p.id) as state1, (SELECT u.ans from user_post_ans u, post_conditions p" +
        " WHERE p.instruction_id = r.instruction_id and p.label = 'نام استان' and u.user_id = r.user_id and" +
        " u.attr_id = p.id) as state2, (SELECT c.state_id from hoghoghi_forms h," +
        " cities c WHERE h.request_id = r.id and h.city_id = c.id) as state3," +
        " (SELECT c.state_id from haghighi_forms h, cities c WHERE" +
        " h.request_id = r.id and h.city_id = c.id) as state4, step, instruction_id, i.name, i.haghighi, i.title, u2.username, u2.phone_num, r.id as reqId, r.follow_code, u2.id as userId" +
        " from users u2, request_queues rq, requests r, instructions i where " +
        "rq.id = ? and supervisor_id = ? and i.id = instruction_id and u2.id = r.user_id" +
        " and rq.request_id = r.id", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [rqId, userId]
    }).then(result => {

        if(result == null || result.length === 0)
            return res.redirect("/myPlans");

        result = result[0];
        let wantedStep = parseInt(result.step);

        Block.findAll({where: {instruction_id: result.instruction_id}, attributes: ['id']}).then(blocks => {

            let blockIds = [];

            for(let i = 0; i < blocks.length; i++)
                blockIds.push(blocks[i].dataValues.id);

            let steps = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    steps.push(tmp[0]);
                });
            }).then(tmp => {

                let wantedBlockId = -1;

                for(let i = 0; i < steps.length; i++) {
                    if(steps[i] === wantedStep) {
                        wantedBlockId = i;
                        break;
                    }
                }

                if(wantedBlockId === -1)
                    return res.redirect("/myPlans");

                BlockAccess.findAll({where: {block_id: wantedBlockId}, attributes: ['form_id']}).then(accesses => {

                    for(let i = 0; i < accesses.length; i++)
                        accesses[i] = accesses[i].dataValues.form_id;


                    let stateId = (result.state1 != null) ? result.state1 :
                        (result.state2 != null) ? result.state2 :
                            (result.state3 != null) ? result.state3 :
                                (result.state4 != null) ? result.state4 : -1;

                    State.findOne({where: {id: stateId}}).then(state => {

                        if(state == null)
                            state = "نامشخص";
                        else
                            state = state.dataValues.name;


                        return res.render('admin/profileFarayand', {
                            'forms': accesses,
                            'name': result.name,
                            'title': result.title,
                            'state': state,
                            'haghighi': result.haghighi,
                            "username": result.username,
                            'userId': result.userId,
                            "phone_num": result.phone_num,
                            "follow_code": result.follow_code,
                            "instId": result.instruction_id,
                            'reqId': result.reqId,
                            csrfToken: req.csrfToken()
                        });
                    });
                });
            });
        });
    });
};

exports.removeResponsible = function (req, res) {

    let id = req.body.id;
    let userId = req.session.user.id;

    userId = 199;

    sequelize.query("update request_queues set step = step - 1, supervisor_id = -1 where supervisor_id = ? and request_id = ?", {
        type: Sequelize.QueryTypes.UPDATE,
        replacements: [userId, id]
    }).then(tmp => {

        if(tmp[1] === 1) {
            sequelize.query("update responsibilities_histories set description = 'canceled' where request_id = ? and supervisor_id = ?", {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [id, userId]
            }).then(tmp => {
                return res.send(JSON.stringify({"status": 'ok'}));
            });
        }
    });

};

function getCountPrev(blockId, result) {

    return sequelize.query("select prev_block from blocks where id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [blockId]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0)
            return -1;

        if(parseInt(tmp[0].prev_block) === -1)
            return result;

        return getCountPrev(tmp[0].prev_block, result + 1);
    });
}

exports.acceptRequest = function(req, res) {

    let reqId = req.body.reqId;
    let userId = req.session.user.id;

    userId = 199;

    sequelize.query("SELECT (SELECT u.ans from user_pre_ans u, preconditions p " +
        "WHERE p.instruction_id = r.instruction_id and p.label = 'نام استان' and u.user_id = r.user_id and " +
        "u.attr_id = p.id) as state1, (SELECT u.ans from user_post_ans u, post_conditions p " +
        "WHERE p.instruction_id = r.instruction_id and p.label = 'نام استان' and u.user_id = r.user_id and " +
        "u.attr_id = p.id) as state2, (SELECT c.state_id from hoghoghi_forms h, " +
        "cities c WHERE h.request_id = r.id and h.city_id = c.id) as state3, " +
        "(SELECT c.state_id from haghighi_forms h, cities c WHERE " +
        "h.request_id = r.id and h.city_id = c.id) as state4, rq.step, rq.id, rq.request_id, r.instruction_id FROM " +
        "request_queues rq, requests r where r.id = rq.request_id and rq.supervisor_id = -1 and r.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [reqId]
    }).then(rq => {

        if(rq == null || rq.length === 0)
            return res.send(JSON.stringify({"status": "nok1"}));

        rq = rq[0];

        let stateId = (rq.state1 != null) ? rq.state1 :
                    (rq.state2 != null) ? rq.state2 :
                    (rq.state3 != null) ? rq.state3 :
                    (rq.state4 != null) ? rq.state4 : -1;

        stateId = 23;

        sequelize.query("select b.id, b.prev_block from blocks b, kargrohs k where " +
            "k.logger = false and b.instruction_id = ? and k.user_id = ? and (b.default_kargroh = k.name or " +
            "(select count(*) from block_kargroh_states bk where bk.state_id = ? and bk.block_id = b.id and bk.kargroh = k.name) > 0)", {
           type: Sequelize.QueryTypes.SELECT,
           replacements: [rq.instruction_id, userId, stateId]
        }).then(result => {

            if(result == null || result.length === 0)
                return res.send(JSON.stringify({"status": "nok2"}));

            let blockIds = [];
            for(let i = 0; i < result.length; i++) {
                blockIds.push(result[i].id);
            }

            let counts = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    counts.push(tmp[0]);
                });
            }).then(response => {

                response = counts;

                for(let i = 0; i < response.length; i++) {

                    if ((parseInt(rq.step) === 0 && result[i].prev_block === -1) || response[i] === parseInt(rq.step)) {

                        sequelize.query("update request_queues set step = step + 1, supervisor_id = ? where id = ?", {
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements: [userId, rq.id]
                        }).then(tmp => {
                            ResponsibilitiesHistory.create({
                                block_id: result[i].id,
                                supervisor_id: userId,
                                request_id: rq.request_id
                            }).then(tmp => {
                                return res.send(JSON.stringify({"status": "ok"}));
                            });
                        })
                    }
                }
            })
        });

    });

};

exports.plans = function (req, res) {

    let userId = req.session.user.id;

    sequelize.query("SELECT (SELECT u.ans from user_pre_ans u, preconditions p " +
        "WHERE p.instruction_id = i.id and p.label = 'نام استان' and u.user_id = r.user_id and " +
        "u.attr_id = p.id) as state1, (SELECT u.ans from user_post_ans u, post_conditions p " +
        "WHERE p.instruction_id = i.id and p.label = 'نام استان' and u.user_id = r.user_id and " +
        "u.attr_id = p.id) as state2, (SELECT c.state_id from hoghoghi_forms h, " +
        "cities c WHERE h.request_id = r.id and h.city_id = c.id) as state3, " +
        "(SELECT c.state_id from haghighi_forms h, cities c WHERE " +
        "h.request_id = r.id and h.city_id = c.id) as state4, r.id, rq.step, i.id as instId, r.follow_code, i.name, username FROM " +
        "users, request_queues rq, instructions i, requests r where i.id = r.instruction_id " +
        "and r.id = rq.request_id and rq.supervisor_id = -1 and users.id = r.user_id", {
        type: Sequelize.QueryTypes.SELECT
    }).then(firstResults => {

        let queryStrings = [];
        let stateId;

        for(let i = 0; i < firstResults.length; i++) {

            stateId = (firstResults[i].state1 != null) ? firstResults[i].state1 :
                (firstResults[i].state2 != null) ? firstResults[i].state2 :
                (firstResults[i].state3 != null) ? firstResults[i].state3 :
                (firstResults[i].state4 != null) ? firstResults[i].state4 : -1;

            userId = 199;

            stateId = 23;

            queryStrings.push("SELECT distinct k.name as kargrohName, b.prev_block, b.name, b.id as blockId, " + firstResults[i].id +
                " as reqId, '" + firstResults[i].username + "' as nid, '" + firstResults[i].follow_code +"' as code, '" +
                firstResults[i].name  + "' as instName, " + firstResults[i].step + " as step, " +
                "(select count(*) from block_kargroh_states bk2, kargrohs k2 where k2.name = bk2.kargroh and k2.logger = false and bk2.block_id = b.id and bk2.state_id = " + stateId +") as stateKargrohExistance, " +
                "(select bk2.kargroh from block_kargroh_states bk2, kargrohs k2 where k2.name = bk2.kargroh and k2.user_id = " + userId + " and k2.logger = false and bk2.block_id = b.id and bk2.state_id = " + stateId +") as stateKargroh " +
                "FROM " +
                "blocks b, kargrohs k " +
                "WHERE k.logger = false and b.instruction_id = "  + firstResults[i].instId + " and k.user_id = " + userId + " and " +
                "(b.default_kargroh = k.name or (select count(*) from block_kargroh_states bk where b.id = bk.block_id and bk.kargroh = k.name and bk.state_id = " + stateId + ") > 0)");
        }

        let out = [];
        let allResults = [];

        Promise.each(queryStrings, (queryString)=> {
            return sequelize.query(queryString, {
                type: Sequelize.QueryTypes.SELECT
            }).then((records) => {
                allResults = allResults.concat(records);
                return records;
            });
        }).then(records => {

            records = allResults;

            let blockIds = [];
            for(let j = 0; j < records.length; j++)
                blockIds.push(records[j].blockId);

            let counts = [];

            Promise.each(blockIds, function (blockId) {
                return Promise.all([getCountPrev(blockId, 0)]).then(tmp => {
                    counts.push(tmp[0]);
                });
            }).then(response => {

                response = counts;

                for(let j = 0; j < response.length; j++) {

                    if(parseInt(records[j].step) === 0 && records[j].prev_block === -1)
                        out.push(records[j]);

                    if(response[j] === parseInt(records[j].step)) {
                        out.push(records[j]);
                    }
                }

                let finalOut = [];

                for(let j = 0; j < out.length; j++) {

                    if(out[j].kargrohName === out[j].stateKargroh) {
                        out[j].kargrohName += " - کارگروه استانی ";
                        finalOut.push(out[j]);
                    }
                    else if(out[j].stateKargrohExistance === 0){
                        out[j].kargrohName += " - کارگروه پیش فرض ";
                        finalOut.push(out[j]);
                    }

                }

                res.render("admin/plans", {
                    csrfToken: req.csrfToken(),
                    plans: finalOut
                });

            });
        });
    });
};