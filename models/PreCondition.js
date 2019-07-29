const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const PreCondition = sequelize.define('precondition', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false
    },
    help: {
        type: Sequelize.STRING
    },
    main_constraint: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    additional_constraint: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    instruction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    options: {
        type: Sequelize.STRING
    },
    error: {
        type: Sequelize.STRING
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = PreCondition;