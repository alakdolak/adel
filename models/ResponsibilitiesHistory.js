const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

// setup User model and its fields.
const ResponsibilitiesHistory = sequelize.define('responsibilities_history', {

    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    request_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    supervisor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    block_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = ResponsibilitiesHistory;