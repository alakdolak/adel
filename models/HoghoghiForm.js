const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const HoghoghiForm = sequelize.define('hoghoghi_form', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        index: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company_kind: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    company_no: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    submit_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    economy_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        index: true,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    post_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    namabar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    site: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pre_tel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pre_namabar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name_status: {
        type: Sequelize.INTEGER
    },
    company_kind_status: {
        type: Sequelize.INTEGER
    },
    company_no_status: {
        type: Sequelize.INTEGER
    },
    submit_date_status: {
        type: Sequelize.INTEGER
    },
    nid_status: {
        type: Sequelize.INTEGER
    },
    economy_code_status: {
        type: Sequelize.INTEGER
    },
    city_id_status: {
        type: Sequelize.INTEGER
    },
    address_status: {
        type: Sequelize.INTEGER
    },
    post_code_status: {
        type: Sequelize.INTEGER
    },
    tel_status: {
        type: Sequelize.INTEGER
    },
    namabar_status: {
        type: Sequelize.INTEGER
    },
    mail_status: {
        type: Sequelize.INTEGER
    },
    site_status: {
        type: Sequelize.INTEGER
    },
    pre_tel_status: {
        type: Sequelize.INTEGER
    },
    pre_namabar_status: {
        type: Sequelize.INTEGER
    },
    name_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company_kind_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company_no_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    submit_date_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nid_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    economy_code_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city_id_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    post_code_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tel_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    namabar_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    site_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pre_tel_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pre_namabar_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = HoghoghiForm;