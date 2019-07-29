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
        type: Sequelize.BOOLEAN
    },
    company_kind_status: {
        type: Sequelize.BOOLEAN
    },
    company_no_status: {
        type: Sequelize.BOOLEAN
    },
    submit_date_status: {
        type: Sequelize.BOOLEAN
    },
    nid_status: {
        type: Sequelize.BOOLEAN
    },
    economy_code_status: {
        type: Sequelize.BOOLEAN
    },
    city_id_status: {
        type: Sequelize.BOOLEAN
    },
    address_status: {
        type: Sequelize.BOOLEAN
    },
    post_code_status: {
        type: Sequelize.BOOLEAN
    },
    tel_status: {
        type: Sequelize.BOOLEAN
    },
    namabar_status: {
        type: Sequelize.BOOLEAN
    },
    mail_status: {
        type: Sequelize.BOOLEAN
    },
    site_status: {
        type: Sequelize.BOOLEAN
    },
    pre_tel_status: {
        type: Sequelize.BOOLEAN
    },
    pre_namabar_status: {
        type: Sequelize.BOOLEAN
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = HoghoghiForm;