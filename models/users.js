const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false });

// setup User model and its fields.
const User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone_num: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: Sequelize.TINYINT
    },
    ques: {
        type: Sequelize.STRING,
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
});

User.prototype.getHashedPass = function(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
};

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;