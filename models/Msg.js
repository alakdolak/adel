const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

// setup User model and its fields.
const Msg = sequelize.define('msg', {

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

    msg: {
        type: Sequelize.TEXT,
        allowNull: false
    },
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = RequestQueue;