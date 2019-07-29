const HoghoghiForm = require('../models/HoghoghiForm');
const ModirAmelForm = require('../models/ModirAmelForm');
const HeyatModireForm = require('../models/HeyatModireForm');
const NamayandeForm = require('../models/NamayandeForm');
const Madarak = require('../models/Madarek');
const HaghighiForm = require('../models/HaghighiForm');
const JavazForm = require('../models/JavazForm');
const SenfForm = require('../models/SenfForm');
const ReqeustQueue = require('../models/RequestQueue');
const Sequelize = require('sequelize');
const Forms = require('../models/Forms');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

function checkPreCondition(instId, userId) {

    let errors = [];

    return sequelize.query("select label from preconditions where (select count(*) from user_pre_ans where mode = true and user_id = " + userId + " and attr_id = preconditions.id) = 0 and instruction_id = " + instId + "",
        { type: Sequelize.QueryTypes.SELECT }
    ).then(result => {

        if(result == null || result.length === 0)
            return errors;

        for(let i = 0; i < result.length; i++) {
            errors[i] = result[i].label;
        }

        return errors;
    });
}

function checkPostCondition(instId, userId) {

    let errors = [];

    return sequelize.query("select label from post_conditions where (select count(*) from user_post_ans where user_id = ? and attr_id = post_conditions.id) = 0 and instruction_id = ? and forceFill = true", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userId, instId]
    }).then(result => {

        if(result == null || result.length === 0)
            return errors;

        for(let i = 0; i < result.length; i++) {
            errors[i] = result[i].label;
        }

        return errors;
    });
}

function checkHoghoghiForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 1}}).then(form => {

        if(form == null)
            return 1;

        return HoghoghiForm.findOne({where: {request_id: reqId}}).then(tmp => {

            if(tmp == null)
                return -1;

            return HoghoghiForm.findOne({where: {nid: tmp.dataValues.nid}}).then(tmp => {
                return (tmp == null) ? 1 : 0;
            });
        })
    });

}

function checkHaghighiForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 13}}).then(form => {

        if(form == null)
            return true;

        return HaghighiForm.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });

}

function checkModiramelForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 2}}).then(form => {

        if(form == null)
            return true;

        return ModirAmelForm.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });
}

function checkHeyatModireForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 3}}).then(form => {

        if(form == null)
            return [true];

        return HeyatModireForm.findAll({where: {request_id: reqId}}).then(tmp => {

            if(tmp == null || tmp.length === 0)
                return [false, null];

            if(tmp.length < 2)
                return [false, "تعداد اعضای هئیت مدیره باید بیشتر از 1 نفر باشد"];

            let nids = [];
            let percent = 0;
            let boss = false;
            let moaven = false;
            let modirAmel = false;

            for(let i = 0; i < tmp.length; i++) {
                if(parseInt(tmp[i].role) === 1) {
                    if(boss)
                        return [false, "تنها یک عضو می تواند به عنوان رئیس هیئت مدیره باشد"];
                    boss = true;
                }
                else if(parseInt(tmp[i].role) === 2) {
                    if(modirAmel)
                        return [false, "تنها یک عضو می تواند به عنوان مدیرعامل باشد"];
                    modirAmel = true;
                }
                else if(parseInt(tmp[i].role) === 4) {
                    if(moaven)
                        return [false, "تنها یک عضو می تواند به عنوان نایب رئیس هیئت مدیره باشد"];
                    moaven = true;
                }
                percent += parseInt(tmp[i].percent);

                for(let j = 0; j < nids.length; j++) {
                    if(nids[j] === tmp[i].nid)
                        return [false, "کد ملی اعضا باید متفاوت باشند"];
                }

                nids[nids.length] = tmp[i].nid;
            }

            if(percent !== 100)
                return [false, "جمع سهام باید 100 باشد"];

            return (boss) ? [true] : [false, "یک نفر باید به عنوان رئیس هیئت مدیره باشد"];
        })
    });
}

function checkSenfForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 14}}).then(form => {

        if(form == null)
            return true;

        return SenfForm.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });
}

function checkJavazForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 12}}).then(form => {

        if(form == null)
            return true;

        return JavazForm.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });
}

function checkNamayandeForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 4}}).then(form => {

        if(form == null)
            return true;

        return NamayandeForm.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });
}

function checkMadarekForm(reqId, instId) {

    let errors = [];

    return sequelize.query("select mode from forms where mode > 4 and instruction_id = " + instId,
        { type: Sequelize.QueryTypes.SELECT }
    ).then(result => {

        let arr = [];

        for(let i = 0; i < result.length; i++)
            arr[i] = result[i].mode;

        result = arr;

        if(result.includes(5) || result.includes(6) || result.includes(7)) {

            return sequelize.query("select key_ from madareks where request_id = " + reqId,
                { type: Sequelize.QueryTypes.SELECT }
            ).then(result2 => {

                arr = [];

                for(let i = 0; i < result2.length; i++)
                    arr[i] = result2[i].key_;

                result2 = arr;

                let counter = 0;
                
                if(result.includes(5)) {
                    let out = {"section": "مدارک شرکت", "url": "/farayand/2/1/" + instId};
                    let arrTmp = [];
                    
                    if(!result2.includes('companyBirthAnnouncement'))
                        arrTmp[counter++] = "پیوست آگهی تاسیس روزنامه رسمی شرکت";
                    if(!result2.includes('companyAsasname'))
                        arrTmp[counter++] = "پیوست اساسنامه شرکت";
                    if(!result2.includes('workHouseCode'))
                        arrTmp[counter++] = "کد کارگاه مرتبط";
                    if(!result2.includes('lastInsuranceList'))
                        arrTmp[counter++] = "پیوست لیست بیمه شرکت در 6 ماه گذشته (نام و نام خانوادگی بیمه شدگان به همراه کد بیمه و کد ملی)";
                    if(!result2.includes('companyProposal'))
                        arrTmp[counter++] = "پیوست رزومه شرکت";
                    
                    if(arrTmp.length > 0) {
                        out["items"] = arrTmp;
                        errors[errors.length] = out;
                    }
                }

                if(result.includes(6)) {
                    if(!result2.includes('modiramel_nid'))
                        errors[errors.length] = {"section": "مدارک مدیرعامل", "url": "/farayand/2/2/" + instId, "items": ["تصویر کارت ملی مدیر عامل"]};
                }

                if(result.includes(7)) {

                    let out = {"section": "مدارک نماینده", "url": "/farayand/2/3/" + instId};
                    let arrTmp = [];
                    counter = 0;

                    if(!result2.includes('namayande_nid'))
                        arrTmp[counter++] = "تصویر کارت ملی نماینده";

                    if(!result2.includes('introducer_namayande'))
                        arrTmp[counter++] = "نامه معرفی رسمی نمایند";

                    if(arrTmp.length > 0) {
                        out["items"] = arrTmp;
                        errors[errors.length] = out;
                    }

                }

                return errors;
            });

        }

        else {
            return errors;
        }

    });
}

function checkMadarekHaghighiForm(reqId, instId) {

    return Forms.findOne({where: {instruction_id: instId, mode: 15}}).then(form => {

        if(form == null)
            return true;

        return Madarak.findOne({where: {request_id: reqId}}).then(tmp => {
            return tmp != null;
        })
    });
}

function checkHaghighiNID(reqId, instId, nid) {

    return Forms.findOne({where: {instruction_id: instId, mode: 13}}).then(tmp => {

        if(tmp == null)
            return true;

        HaghighiForm.findOne().then(tmp => {

            if(tmp == null)
                return true;

            return (tmp.nid === nid);
        });

    });
}

function checkHoghoghiNID(reqId, instId, nid) {


    return sequelize.query("SELECT nid from forms, modiramel_forms WHERE instruction_id = " + instId + " and mode = 2 and request_id = " + reqId,
        { type: Sequelize.QueryTypes.SELECT }
    ).then(result => {

        if (result == null || result.length === 0 || result.nid === nid)
            return true;

        return sequelize.query("SELECT nid from forms, namayande_forms WHERE instruction_id = " + instId + " and mode = 4 and request_id = " + reqId,
            { type: Sequelize.QueryTypes.SELECT }
        ).then(result => {

            return result == null || result.length === 0 || result.nid === nid;

        });
    });

    return Forms.findOne({where: {instruction_id: instId, mode: 2}}).then(tmp => {

        if(tmp == null) {
            return Forms.findOne({where: {instruction_id: instId, mode: 4}}).then(tmp => {
                if(tmp == null)
                    return true;


            });
        }

        else {

        }
        HaghighiForm.findOne().then(tmp => {

            if(tmp == null)
                return true;

            return (tmp.nid === nid);
        });

    });
}

// function checkHoghoghiNID(reqId, instId, nid) {
//
//
//     return sequelize.query("SELECT nid from forms, modiramel_forms WHERE instruction_id = " + instId + " and mode = 2 and request_id = " + reqId,
//         { type: Sequelize.QueryTypes.SELECT }
//     ).then(result => {
//
//         if (result == null || result.length === 0 || result.nid === nid)
//             return true;
//
//         return sequelize.query("SELECT nid from forms, namayande_forms WHERE instruction_id = " + instId + " and mode = 4 and request_id = " + reqId,
//             { type: Sequelize.QueryTypes.SELECT }
//         ).then(result => {
//
//             return result == null || result.length === 0 || result.nid === nid;
//
//         });
//     });
//
//     return Forms.findOne({where: {instruction_id: instId, mode: 2}}).then(tmp => {
//
//         if(tmp == null) {
//             return Forms.findOne({where: {instruction_id: instId, mode: 4}}).then(tmp => {
//                 if(tmp == null)
//                     return true;
//
//
//             });
//         }
//
//         else {
//
//         }
//         HaghighiForm.findOne().then(tmp => {
//
//             if(tmp == null)
//                 return true;
//
//             return (tmp.nid === nid);
//         });
//
//     });
// }

exports.finalize = function (req, res) {

    let instId = req.params.instId;
    let userId = req.session.user.id;
    let out = [];

    sequelize.query("select id from requests where instruction_id = ? and user_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId, userId]
    }).then(tmp => {

        if(tmp == null || tmp.length === 0) {
            out[0] = {"section": "درخواست شما نامعتبر است", "url": "", "items": []};
            res.send(JSON.stringify({'status': 'nok', 'items': out}, null, 4));
            return;
        }

        tmp = tmp[0];

        Promise.all([
            checkPostCondition(instId, userId),
            checkPreCondition(instId, userId),
            checkHoghoghiForm(tmp.id, instId),
            checkModiramelForm(tmp.id, instId),
            checkHeyatModireForm(tmp.id, instId),
            checkNamayandeForm(tmp.id, instId),
            checkJavazForm(tmp.id, instId),
            checkHaghighiForm(tmp.id, instId),
            checkSenfForm(tmp.id, instId),
            checkMadarekHaghighiForm(tmp.id, instId),
            checkMadarekForm(tmp.id, instId),
            // checkHaghighiNID(tmp.dataValues.id, instId, req.session.user.nid)
        ])
            .then(function (result) {
            let errors = result[0];
            let counter = 0;
            let arr;

            arr = [];

            if(errors.length > 0) {
                for (let i = 0; i < errors.length; i++)
                    arr[i] = errors[i];

                out[counter++] = {"section": "اطلاعات طرح", "url": '/postcondition/' + instId, "items": arr};
            }

            errors = result[1];
            if(errors.length > 0) {
                arr = [];
                for (let i = 0; i < errors.length; i++)
                    arr[i] = errors[i];

                out[counter++] = {"section": "پیش شرط های وام", "url": '/prefarayand/' + instId, "items": arr};
            }

            if(result[2] === -1)
                out[counter++] = {"section": "اطلاعات حقوقی", "url": "/farayand/1/1/" + instId, "items": []};

            else if(result[2] === 0) {
                out[counter++] = {"section": "اطلاعات حقوقی", "err": "شناسه ملی شرکت شما در سامانه موجود است", "url": "/farayand/1/1/" + instId, "items": []};
            }

            if(!result[3])
                out[counter++] = {"section": "اطلاعات مدیرعامل", "url": "/farayand/1/2/" + instId, "items": [] };

            if(!result[4][0]) {
                if(result[4][1] == null)
                    out[counter++] = {"section": "اطلاعات هیئت مدیره", "url": "/farayand/1/3/" + instId, "items": [] };
                else
                    out[counter++] = {"section": "اطلاعات هیئت مدیره", "err": result[4][1], "url": "/farayand/1/3/" + instId, "items": [] };
            }

            if(!result[5])
                out[counter++] = {"section": "اطلاعات نماینده", "url": "/farayand/1/4/" + instId, "items": [] };

            if(!result[6])
                out[counter++] = {"section": "اطلاعات حقیقی صاحبان جواز", "url": "/farayand/1/1/" + instId, "items": []  };

            if(!result[7])
                out[counter++] = {"section": "اطلاعات حقیقی اقدام کننده", "url": "/farayand/1/2/" + instId, "items": [] };

            if(!result[8])
                out[counter++] = {"section": "اطلاعات حقیقی واحد صنفی", "url": "/farayand/1/3/" + instId, "items": [] };

            if(!result[9])
                out[counter++] = {"section": "اطلاعات صاحبان", "url": "/farayand/2/1/" + instId, "items": [] };

            errors = result[10];

            for(let i = 0; i < errors.length; i++)
                out[counter++] = errors[i];

            if(out.length > 0)
                res.send(JSON.stringify({'status': 'nok', 'items': out}, null, 4));
            else {
                ReqeustQueue.create({
                    request_id: tmp.id,
                    supervisor_id: 1,
                    percent: 0
                }).then(tmp => {
                    res.send(JSON.stringify({'status': 'ok'}, null, 4));
                }).catch(x => {
                    console.log(x);
                });
            }
        });
    });
};