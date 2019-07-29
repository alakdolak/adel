const childProcess = require('child_process');
const CronJob = require('cron').CronJob;

var username = "hemayat_root";
var password = "QaS5rtWb2X4wAN2Q";
var databaseName = "hemayat";
var moment = require("moment");

var createKey = (()=> {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var key  = year + "/" + month + "/" + databaseName + '-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.sql';
    return key;
});

var uploadToS3 = ((key, buffer)=> {
    //console.log(key);
});

var takingDump = (()=> {
        console.log("sad");
    var dumpCommand = `mysqldump -u${username} -p${password} ${databaseName}`;
    //dumpCommand mysqldump -uroot -proot demo
    childProcess.exec(dumpCommand, (error, stdout, stderr)=> {
        var bufferData = Buffer.from(stdout, 'utf8');
        console.log("done");
        uploadToS3(createKey(), bufferData);
    });
});

//Taking a dump every day
var job = new CronJob('00 00 10 * * *', function () {
        takingDump();
    }, function () {
    },
    true, // Start the job right now
    "Asia/Tehran" //!* UTC Time 00:00*!/
);
console.log("wq");
//If you want to take dump now
takingDump();

//
// .user-profile-area
//     .container-fluid
//     .row
//     .col-lg-12.col-md-12.col-sm-12.col-xs-12(style= "margin-top: 20px;")
//     .user-profile-wrap.shadow-reset
//     .row
//     .col-lg-4.col-sm-6.col-xs-12(style= "float: right")
//     .row
//     .col-lg-2.col-xs-2(style= "float: right")
//     .user-profile-img
// img(src='assets/img/img/notification/5.jpg', alt='')
//     .col-lg-10.col-xs-10(style= "float: right")
//     .user-profile-content
// h2 نام شخص حقیقی یا حقوقی
// p.profile-founder
// strong نام طرح
// p.profile-des توضیحات طرح: فیلد ورودی توسط کاربر
//     .col-lg-4.col-sm-6.col-xs-12(style= "float: right")
//     .user-profile-social-list
// table.table.small.m-b-xs
// tbody
// tr
// td
// | شهر یا استان طرح
// strong 542
// td
// | مبلغ درخواستی
// strong 222
// tr
// td
// | درخواست پیشین
// strong دارد/ندارد
// td
// | شرایط ویژه
// strong دارد/ندارد
// tr
// td
// | درخواست پیشین سایر اعضا
// strong دارد/ندارد
// td
//
//     //.col-lg-4.col-xs-12(style= "float: right")
//     .analytics-sparkle-line.user-profile-sparkline
//     .analytics-content
// h5(style= "width: 100%;") Visits in last 24h
// h2.counter 498009
// #sparkline22