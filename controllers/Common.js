const Sequelize = require('sequelize');
const moment = require('jalali-moment');
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});
const bcrypt = require('bcrypt');

exports.makeRand = function(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.vmsNationalCode = function(input) {

    if (!/^\d{10}$/.test(input)
        || input==='0000000000'
        || input==='1111111111'
        || input==='2222222222'
        || input==='3333333333'
        || input==='4444444444'
        || input==='5555555555'
        || input==='6666666666'
        || input==='7777777777'
        || input==='8888888888'
        || input==='9999999999')
        return false;
    let check = parseInt(input[9]);
    let sum = 0;
    let i;
    for (i = 0; i < 9; ++i) {
        sum += parseInt(input[i]) * (10 - i);
    }
    sum %= 11;
    return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
};

exports.isValidPreTel = function(pre, cityId) {

    return sequelize.query("select s.pre_phone_code from states s, cities c where state_id = s.id and c.id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [cityId]
    }).then(result => {

        if(result == null || result.length === 0)
            return false;

        return (result[0].pre_phone_code == pre);
    });

};

exports.isValidNumber = function(str) {

    if(str === undefined || str.length === 0)
        return false;

    for (let i = 0; i < str.length; i++) {
        if(str.charCodeAt(i) > 31 && (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57))
            return false;
    }

    return true;
};

exports.getModeName = function (tmpVal) {
    switch (tmpVal) {
        case 1:
            return ["اطلاعات حقوقی", "اطلاعات ثبتی شرکت را وارد کنید"];
        case 2:
            return ["اطلاعات مدیرعامل", "اطلاعات حقیقی مدیر عامل را وارد کنید"];
        case 3:
            return ["اطلاعات هیأت مدیره", "اطلاعات حقیقی هیأت مدیره را وارد کنید"];
        case 4:
            return ["اطلاعات نماینده", "اطلاعات حقیقی نماینده را وارد کنید"];
        case 5:
            return ["اطلاعات شرکت", "مدارک ثبتی را ضمیمه نمایید"];
        case 6:
            return ["اطلاعات مدیر عامل", "مدارک حقوقی مرتبط با مدیر عامل را ضمیمه نمایید"];
        case 7:
            return ["مدارک نماینده", "مدارک حقوقی مرتبط با نماینده را ضمیمه نمایید"];
        case 8:
            return ["اطلاعات حقوقی", "اطلاعات ثبتی شرکت را وارد کنید"];
        case 9:
            return ["طرح تجاری", "طرح تجاری خود را وارد کنید"];
        case 12:
            return ["اطلاعات حقیقی صاحبان جواز", "اطلاعات حقیقی صاحبان جواز را وارد نمایید"];
        case 13:
            return ["اطلاعات حقیقی اقدام کننده", "اطلاعات حقیقی اقدام کننده"];
        case 14:
            return ["اطلاعات حقیقی واحد صنفی", "اطلاعات حقیقی واحد صنفی"];
        case 15:
            return ["اطلاعات صاحبان", "مدارک حقوقی مرتبط با اقدام کننده را ضمیمه نمایید"];
    }
};

exports.getValueInfo = function (tmpVal) {

    let arr = [];

};

function getToday() {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return moment(today, 'MM/DD/YYYY').locale('fa').format('YYYY/MM/DD');
}

exports.getFormattedToday = function () {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return moment(today, 'MM/DD/YYYY').locale('fa').format('YYYYMMDD');
};

exports.diffDayWithToday = function (date, diff) {

    let today = getToday();
    let m = moment(today, 'jYYYY/jMM/jDD');
    m.subtract(diff, 'jYear');
    let src = m.format('jYYYYjMMjDD');
    return (date > src);
};

exports.getLast = function(diff) {

    let m = moment(getToday(), 'jYYYY/jM/jD');
    m.subtract(diff, 'jDay');
    return m.locale('fa').format('YYYYMMDD');
};

exports.addDate = function(date, diff) {
    let m = moment(date, 'jYYYY/jM/jD');
    m.add(diff, 'jDay');
    return m.format('jYYYY/jMM/jDD');
};

exports.diffDateWithToday = function (date) {

    let start = moment(new Date());
    let end = moment(date, 'jYYYY/jMM/jDD').format('YYYY/M/D');

    let duration = moment.duration(start.diff(end));
    let days = duration.asDays();
    return Math.abs(Math.floor(days));
};

exports.convertMiladyToJalali = function (date) {

    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;

    return moment(date, 'MM/DD/YYYY').locale('fa').format('YYYY/MM/DD');
};

exports.getNerkh = function (bahre_tehran, bahre_other, karmozd) {

    if(bahre_tehran !== 0) {
        if(bahre_other !== bahre_tehran)
            return bahre_other + " الی " + bahre_tehran;
        return bahre_other;
    }

    return karmozd;
};

exports.getHashedPass = function(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
};

exports.validPass = function(pass) {

    if(pass.length < 8)
        return false;

    let lowerCase = false;
    let upperCase = false;
    let num = false;
    // let special = false;

    for(let i = 0; i < pass.length; i++) {

        if(pass.charAt(i) >= 'a' && pass.charAt(i) <= 'z')
            lowerCase = true;

        if(pass.charAt(i) >= 'A' && pass.charAt(i) <= 'Z')
            upperCase = true;

        if(pass.charAt(i) >= '0' && pass.charAt(i) <= '9')
            num = true;

        // if(pass.charAt(i) === "#" || pass.charAt(i) === "$" || pass.charAt(i) === "*" ||
        //     pass.charAt(i) === "^" || pass.charAt(i) === "@" || pass.charAt(i) === "!" ||
        //     pass.charAt(i) === "%" || pass.charAt(i) === "&")
        //     special = true;
    }

    // return (special && lowerCase && upperCase && num);
    return (lowerCase && upperCase && num);
};