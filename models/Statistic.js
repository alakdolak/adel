const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const Statistic = sequelize.define('statistic', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    counter: {
        type: Sequelize.INTEGER
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Statistic;