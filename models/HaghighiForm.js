const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const HaghighiForm = sequelize.define('haghighi_form', {
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
    mail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
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
    first_name_status: {
        type: Sequelize.BOOLEAN
    },
    last_name_status: {
        type: Sequelize.BOOLEAN
    },
    nid_status: {
        type: Sequelize.BOOLEAN
    },
    mail_status: {
        type: Sequelize.BOOLEAN
    },
    phone_status: {
        type: Sequelize.BOOLEAN
    },
    city_id_status: {
        type: Sequelize.BOOLEAN
    },
    address_status: {
        type: Sequelize.BOOLEAN
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = HaghighiForm;