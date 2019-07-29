const Inst = require('../models/Instruction');
const Common = require('../controllers/Common');
const State = require('../models/State');
const Request = require('../models/Request');
const City = require('../models/Cities');
const HaghighiForm = require('../models/HaghighiForm');
const SenfForm = require('../models/SenfForm');
const HoghoghiForm = require('../models/HoghoghiForm');
const ModirAmelForm = require('../models/ModirAmelForm');
const NamayandeForm = require('../models/NamayandeForm');
const PreCondition = require('../models/PreCondition');
const PreActor = require('../models/PreActor');
const Sequelize = require('sequelize');
const PostCondition = require('../models/PostCondition');
const Madarak = require('../models/Madarek');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

exports.farayand = function(req, res) {

    let stepId = req.params.step;
    let instId = req.params.instId;
    let subStepId = req.params.subStep;

    let where = {step: stepId, instruction_id: instId};
    sequelize.query("select mode, step, sub_step from forms where step = ? and instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [stepId, instId]
    }).then(forms => {

        let form = null;
        let gams = [];

        for (let i = 0; i < forms.length; i++) {

            gams[i] = {};
            let name_desc = Common.getModeName(forms[i].mode);
            gams[i].name = name_desc[0];
            gams[i].desc = name_desc[1];
            gams[i].selected = false;
            gams[i].url = '/farayand/' + forms[i].step + "/" + forms[i].sub_step + "/" + instId;

            if(parseInt(forms[i].sub_step) === parseInt(subStepId)) {
                form = forms[i];
                gams[i].selected = true;
            }
        }

        if(form != null) {

            where = {id: instId};
            sequelize.query("select * from instructions where id = ?", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [instId]
            }).then(inst => {

                if(inst != null && inst.length > 0) {

                    inst = inst[0];
                    let mode = form.mode;

                    if(inst.bahre_tehran !== 0) {
                        if(inst.bahre_other !== inst.bahre_tehran)
                            inst.nerkh = inst.bahre_other + " الی " + inst.bahre_tehran;
                        else
                            inst.nerkh = inst.bahre_other;
                    }
                    else
                        inst.nerkh = inst.karmozd;

                    State.findAll().then(states => {

                        let arr = [];

                        for (let i = 0; i < states.length; i++) {
                            arr[i] = states[i].dataValues;
                        }

                        let code = "";
                        let user_form = null;

                        let toViewArr = {
                            'mode': mode,
                            'step': stepId,
                            'inst': inst,
                            'gams': gams,
                            'states': arr,
                            'csrfToken': req.csrfToken()
                        };

                        PreCondition.findOne({where: {instruction_id: inst.id}}).then(tmpPreCond => {

                            toViewArr["hasPreCondition"] = !(tmpPreCond == null);

                            PreActor.findOne({where: {instruction_id: inst.id}}).then(tmpPreCond2 => {

                                toViewArr["hasPreActor"] = !(tmpPreCond2 == null);

                                PostCondition.findOne({where: {instruction_id: inst.id}}).then(tmpPreCond3 => {

                                    toViewArr["hasPostCondition"] = !(tmpPreCond3 == null);

                                    if(tmpPreCond3 == null) {
                                        if (tmpPreCond == null && tmpPreCond2 == null)
                                            toViewArr['redirects'] = ['/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                                        else if(tmpPreCond2 == null)
                                            toViewArr['redirects'] = ['/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                                        else if(tmpPreCond == null )
                                            toViewArr['redirects'] = ['/preactor/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                                        else
                                            toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                                    }
                                    else {
                                        if (tmpPreCond == null && tmpPreCond2 == null)
                                            toViewArr['redirects'] = ['/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                                        else if(tmpPreCond2 == null)
                                            toViewArr['redirects'] = ['/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                                        else if(tmpPreCond == null )
                                            toViewArr['redirects'] = ['/preactor/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                                        else
                                            toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                                    }

                                    where = {instruction_id: inst.id, user_id: req.session.user.id};
                                    Request.findOne({where: where}).then(request => {

                                        if (request == null) {
                                            toViewArr["user_form"] = user_form;
                                            toViewArr["code"] = code;
                                            return res.render('farayands/template', toViewArr);
                                        }

                                        else {
                                            code = request.follow_code;
                                            toViewArr["code"] = code;
                                            where = {request_id: request.id};

                                            switch (mode) {
                                                case 1:
                                                    HoghoghiForm.findOne({where: where}).then(user_form => {

                                                        if (user_form != null) {
                                                            let submit_date = user_form.submit_date;
                                                            user_form.submit_date_day = submit_date.split("/")[2];
                                                            user_form.submit_date_month = submit_date.split("/")[1];
                                                            user_form.submit_date_year = submit_date.split("/")[0];
                                                            where = {id: user_form.city_id};

                                                            City.findOne({where: where}).then(city => {

                                                                user_form.state_id = city.state_id;
                                                                toViewArr["user_form"] = user_form;

                                                                res.render('farayands/template', toViewArr);
                                                            });
                                                        }
                                                        else {
                                                            toViewArr["user_form"] = user_form;
                                                            res.render('farayands/template', toViewArr);
                                                        }
                                                    });
                                                    break;

                                                case 2:
                                                    ModirAmelForm.findOne({where: where}).then(user_form => {
                                                        toViewArr["user_form"] = user_form;
                                                        res.render('farayands/template', toViewArr);
                                                    });
                                                    break;

                                                case 3:
                                                case 12:
                                                    res.render('farayands/template', toViewArr);
                                                    break;

                                                case 4:
                                                    NamayandeForm.findOne({where: where}).then(user_form => {
                                                        toViewArr["user_form"] = user_form;
                                                        res.render('farayands/template', toViewArr);
                                                    });
                                                    break;

                                                case 13:
                                                    HaghighiForm.findOne({where: where}).then(user_form => {

                                                        if (user_form != null) {
                                                            where = {id: user_form.city_id};

                                                            City.findOne({where: where}).then(city => {

                                                                user_form.state_id = city.state_id;
                                                                toViewArr["user_form"] = user_form;

                                                                res.render('farayands/template', toViewArr);
                                                            });
                                                        }
                                                        else {
                                                            toViewArr["user_form"] = user_form;
                                                            res.render('farayands/template', toViewArr);
                                                        }
                                                    });
                                                    break;

                                                case 14:
                                                    SenfForm.findOne({where: where}).then(user_form => {

                                                        if (user_form != null) {
                                                            where = {id: user_form.city_id};

                                                            City.findOne({where: where}).then(city => {

                                                                user_form.state_id = city.state_id;
                                                                toViewArr["user_form"] = user_form;

                                                                res.render('farayands/template', toViewArr);
                                                            });
                                                        }
                                                        else {
                                                            toViewArr["user_form"] = user_form;
                                                            res.render('farayands/template', toViewArr);
                                                        }
                                                    });
                                                    break;

                                                case 5:
                                                case 6:
                                                case 15:
                                                case 7:
                                                    toViewArr["code"] = code;
                                                    Madarak.findAll({where: where}).then(user_form => {
                                                        toViewArr["user_form"] = user_form;
                                                        res.render('farayands/template', toViewArr);
                                                    });
                                                    break;
                                            }
                                        }

                                    });

                                });
                            });
                        });

                    });
                }
            });
        }
        else
            res.redirect('/');
    });
};

exports.preactor = function(req, res) {

    let instId = req.params.instId;

    sequelize.query("SELECT pre_actors.*, myTable.ans FROM pre_actors LEFT JOIN (select * from user_pre_ans WHERE mode = false and user_id = ?) as myTable on attr_id = pre_actors.id WHERE instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id, instId]
    }).then(attrs => {

        if(attrs.length === 0)
            return res.redirect('/prefarayand/' + instId);

        for(let z = 0; z < attrs.length; z++) {
            if(attrs[z].type === 6) {

                let vals = [];
                let tmp = attrs[z].options.split("@");

                for(let k = 0; k < tmp.length; k++) {
                    let tmpTmp = tmp[k].split("_");
                    vals[k] = {'id': tmpTmp[0], 'name': tmpTmp[1]};
                }

                attrs[z].vals = vals;
            }
        }

        instId = attrs[0].instruction_id;

        let where = {id: instId};
        Inst.findOne({where: where}).then(inst => {

            if(inst == null)
                return res.redirect('home');

            let gams = [{'name': 'شرایط ویژه بازپرداخت', 'desc': 'اگر شرایط ویژه ای دارید، وارد کنید.', 'url': '/preactor/' + instId, 'selected': true}];

            inst.nerkh = Common.getNerkh(inst.bahre_tehran, inst.bahre_other, inst.karmozd);

            let hasPreCondition = false;
            let hasPostCondition = false;

            let toViewArr = {
                'attrs': attrs,
                'mode': 10,
                'step': -1,
                'inst': inst,
                'hasPreActor': true,
                'gams': gams,
                'specialCities': 0,
                'csrfToken': req.csrfToken()
            };

            PreCondition.findOne({where: {instruction_id: instId}}).then(tmp => {

                if(tmp != null)
                    hasPreCondition = true;

                PostCondition.findOne({where: {instruction_id: instId}}).then(tmp => {

                    if (tmp != null)
                        hasPostCondition = true;

                    if(hasPostCondition) {
                        if (hasPreCondition)
                            toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                        else {
                            toViewArr['redirects'] = ['/preactor/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                        }
                    }
                    else {
                        if (hasPreCondition)
                            toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                        else {
                            toViewArr['redirects'] = ['/preactor/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                        }
                    }

                    toViewArr['hasPreCondition'] = hasPreCondition;
                    toViewArr['hasPostCondition'] = hasPostCondition;

                    let code = "";
                    where = {instruction_id: instId, user_id: req.session.user.id};
                    Request.findOne({where: where}).then(request => {
                        code = (request != null) ? request.dataValues.follow_code : "";
                        toViewArr["code"] = code;
                        res.render('farayands/template', toViewArr);
                    });
                });
            });
        });
    });
};

exports.prefarayand = function(req, res) {

    let instId = req.params.instId;
    let specialCities = 0;

    sequelize.query("SELECT preconditions.*, myTable.ans FROM preconditions LEFT JOIN (select * from user_pre_ans WHERE mode = true and user_id = ?) as myTable on attr_id = preconditions.id WHERE instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id, instId]
    }).then(attrs => {

        if(attrs.length === 0)
            return res.redirect('/farayand/1/1/' + instId);

        instId = attrs[0].instruction_id;

        for(let z = 0; z < attrs.length; z++) {
            if(attrs[z].type === 6) {

                let vals = [];
                let tmp = attrs[z].options.split("@");

                for(let k = 0; k < tmp.length; k++) {
                    let tmpTmp = tmp[k].split("_");
                    vals[k] = {'id': tmpTmp[0], 'name': tmpTmp[1]};
                }

                attrs[z].vals = vals;
            }

            else if(attrs[z].type === 9 && attrs[z].main_constraint === 11) {
                specialCities = 1;
            }
        }

        Inst.findOne({where: {id: instId}}).then(inst => {

            if(inst == null)
                return res.redirect('home');

            let gams = [{'name': 'پیش شرط های وام', 'desc': 'اطلاعات را متناسب با شرایط خود، وارد کنید.', 'url': '/prefarayand/' + instId, 'selected': true}];

            inst.nerkh = Common.getNerkh(inst.bahre_tehran, inst.bahre_other, inst.karmozd);

            let toViewArr = {
                'attrs': attrs,
                'mode': 10,
                'inst': inst,
                'gams': gams,
                'hasPreCondition': true,
                'specialCities': specialCities,
                'csrfToken': req.csrfToken()
            };

            let step = 0;
            let code = "";
            let hasPreActor = false;
            let hasPostCondition = false;

            PreActor.findOne({where: {instruction_id: instId}}).then(tmp => {

                if(tmp != null)
                    hasPreActor = true;

                PostCondition.findOne({where: {instruction_id: instId}}).then(tmp => {

                    if(tmp != null)
                        hasPostCondition = true;

                    if(instId == 4) {

                        if(hasPostCondition) {
                            if(hasPreActor)
                                toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/postcondition/' + instId];
                            else
                                toViewArr['redirects'] = ['/prefarayand/' + instId, '/postcondition/' + instId];
                        }
                        else {
                            if(hasPreActor)
                                toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId];
                            else
                                toViewArr['redirects'] = ['/prefarayand/' + instId];
                        }
                    }

                    else {
                        if(hasPostCondition) {
                            if(hasPreActor)
                                toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                            else
                                toViewArr['redirects'] = ['/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                        }
                        else {
                            if(hasPreActor)
                                toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                            else
                                toViewArr['redirects'] = ['/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId];
                        }
                    }

                    toViewArr["hasPreActor"] = hasPreActor;
                    toViewArr["hasPostCondition"] = hasPostCondition;
                    toViewArr["step"] = step;

                    Request.findOne({where: {instruction_id: instId, user_id: req.session.user.id}}).then(request => {
                        code = (request != null) ? request.dataValues.follow_code : "";
                        toViewArr["code"] = code;
                        res.render('farayands/template', toViewArr);
                    });
                });

            });
        });
    });
};

exports.postcondition = function(req, res) {

    let instId = req.params.instId;

    sequelize.query("SELECT post_conditions.*, myTable.ans FROM post_conditions LEFT JOIN (select * from user_post_ans WHERE user_id = ?) as myTable on attr_id = post_conditions.id WHERE instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [req.session.user.id, instId]
    }).then(attrs => {

        if(attrs.length === 0)
            return res.redirect('/home');

        instId = attrs[0].instruction_id;

        for(let z = 0; z < attrs.length; z++) {
            if(attrs[z].type === 6) {

                let vals = [];
                let tmp = attrs[z].options.split("@");

                for(let k = 0; k < tmp.length; k++) {
                    let tmpTmp = tmp[k].split("_");
                    vals[k] = {'id': tmpTmp[0], 'name': tmpTmp[1]};
                }

                attrs[z].vals = vals;
            }
        }

        let where = {id: instId};
        Inst.findOne({where: where}).then(inst => {

            if(inst == null)
                return res.redirect('home');

            let gams = [{'name': 'اطلاعات تکمیلی تسهیلات', 'desc': 'طرح خود را توضیح دهید.', 'url': '/postcondition/' + instId, 'selected': true}];

            inst.nerkh = Common.getNerkh(inst.bahre_tehran, inst.bahre_other, inst.karmozd);

            let toViewArr = {
                'attrs': attrs,
                'mode': 11,
                'inst': inst,
                'gams': gams,
                'hasPostCondition': true,
                'specialCities': 0,
                'csrfToken': req.csrfToken()
            };

            let step = 3;
            let hasPreActor = false;
            let hasPreCondition = false;

            PreActor.findOne({where: {instruction_id: instId}}).then(tmp => {

                if(tmp != null)
                    hasPreActor = true;

                PreCondition.findOne({where: {instruction_id: instId}}).then(tmp => {

                    if(tmp != null)
                        hasPreCondition = true;

                    if(hasPreCondition) {
                        if(hasPreActor)
                            toViewArr['redirects'] = ['/preactor/' + instId, '/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                        else
                            toViewArr['redirects'] = ['/prefarayand/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                    }
                    else {
                        if(hasPreActor)
                            toViewArr['redirects'] = ['/preactor/' + instId, '/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                        else
                            toViewArr['redirects'] = ['/farayand/1/1/' + instId, '/farayand/2/1/' + instId, '/postcondition/' + instId];
                    }

                    let code = "";

                    where = {instruction_id: instId, user_id: req.session.user.id};
                    Request.findOne({where: where}).then(request => {

                        toViewArr["hasPreActor"] = hasPreActor;
                        toViewArr["hasPreCondition"] = hasPreCondition;
                        toViewArr["step"] = step;

                        code = (request != null) ? request.dataValues.follow_code : "";
                        toViewArr["code"] = code;

                        res.render('farayands/template', toViewArr);
                    });
                });

            });
        });
    });
};

exports.verifyFollowUpCode = function (req, res) {

    let code = req.body.code;
    let user_id = req.session.user.id;

    sequelize.query("select instruction_id from requests where follow_code = ? and user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [code, user_id]
    }).then(request => {

        if(request == null || request.length === 0)
            res.send(JSON.stringify({'status': 'nok'}), null, 4);
        else
            res.send(JSON.stringify({'status': 'ok', 'url': '/prefarayand/' + request[0].instruction_id}), null, 4);
    });

};
