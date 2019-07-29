const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false, define: {
    timestamps: false
}});

// setup User model and its fields.
const BlockKargrohState = sequelize.define('block_kargroh_state', {

    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    block_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    kargroh: {
        type: Sequelize.STRING,
        allowNull: false
    },

    state_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = BlockKargrohState;