const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false, define: {
    timestamps: false
}});

// setup User model and its fields.
const Block = sequelize.define('block', {

    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    default_kargroh: {
        type: Sequelize.STRING,
        allowNull: false
    },

    instruction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    duration: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    init_notice: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    final_notice: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    prev_block: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Block;