const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const HeyatModireForm = sequelize.define('heyatmodire_form', {
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
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    percent: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    first_name_status: {
        type: Sequelize.INTEGER
    },
    last_name_status: {
        type: Sequelize.INTEGER
    },
    nid_status: {
        type: Sequelize.INTEGER
    },
    role_status: {
        type: Sequelize.INTEGER
    },
    percent_status: {
        type: Sequelize.INTEGER
    },
    first_name_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nid_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    },
    percent_err_log: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = HeyatModireForm;