const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define:{
        timestamps: true
    }
});

// setup User model and its fields.
const Request = sequelize.define('request', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    instruction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        index: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        index: true
    },
    follow_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        index: true
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Request;