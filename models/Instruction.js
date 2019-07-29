const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', {logging: false, define: {
        timestamps: false
    }});

// setup User model and its fields.
const Instruction = sequelize.define('instruction', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    kasbokar: {
        type: Sequelize.TINYINT
    },
    karafarini: {
        type: Sequelize.TINYINT
    },
    eshteghal: {
        type: Sequelize.TINYINT
    },
    sherakat: {
        type: Sequelize.TINYINT
    },
    kind: {
        type: Sequelize.INTEGER,
        length: 1
    },
    duration: {
        type: Sequelize.INTEGER,
        length: 4
    },
    zamine: {
        type: Sequelize.STRING,
        allowNull: false
    },
    haghighi: {
        type: Sequelize.TINYINT
    },
    shetabdahande: {
        type: Sequelize.TINYINT
    },
    activity_branch: {
        type: Sequelize.TINYINT
    },
    nopa: {
        type: Sequelize.TINYINT
    },
    startup: {
        type: Sequelize.TINYINT
    },
    fanavar: {
        type: Sequelize.TINYINT
    },
    kharidar: {
        type: Sequelize.TINYINT
    },
    sherkat: {
        type: Sequelize.TINYINT
    },
    bahre_tehran: {
        type: Sequelize.INTEGER,
        length: 2
    },
    bahre_other: {
        type: Sequelize.INTEGER,
        length: 2
    },
    max_: {
        type: Sequelize.BIGINT
    },
    karmozd: {
        type: Sequelize.INTEGER,
        length: 2
    },
    tanafos: {
        type: Sequelize.INTEGER,
        length: 2
    },
    bazpardakht: {
        type: Sequelize.INTEGER,
        length: 2
    },
    bazpardakht_total: {
        type: Sequelize.INTEGER,
        length: 3
    },
    payment_condition: {
        type: Sequelize.STRING,
        allowNull: false
    },
    payment_kind: {
        type: Sequelize.INTEGER,
        length: 1
    },
    parent: {
        type: Sequelize.INTEGER,
        length: 1
    },
    bp: {
        type: Sequelize.STRING,
        allowNull: false
    },
    titr_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gam_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc_gam_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gam_2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc_gam_2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gam_3: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc_gam_3: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gam_4: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc_gam_4: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tedad_madarek: {
        type: Sequelize.STRING,
        allowNull: false
    },
    needed_info: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    needed_certificate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start: {
        type: Sequelize.TINYINT,
        length: 1
    },
    company: {
        type: Sequelize.TINYINT,
        length: 1
    },
    nopa_co: {
        type: Sequelize.TINYINT,
        length: 1
    },
    learner: {
        type: Sequelize.TINYINT,
        length: 1
    },
    teacher: {
        type: Sequelize.TINYINT,
        length: 1
    },
    employee: {
        type: Sequelize.TINYINT,
        length: 1
    },
    accs: {
        type: Sequelize.TINYINT,
        length: 1
    },
    vc: {
        type: Sequelize.TINYINT,
        length: 1
    },
    shahid: {
        type: Sequelize.TINYINT,
        length: 1
    },
    tavan: {
        type: Sequelize.TINYINT,
        length: 1
    },
    madad: {
        type: Sequelize.TINYINT,
        length: 1
    },
    notice: {
        type: Sequelize.STRING
    },
    mablagh: {
        type: Sequelize.STRING
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Instruction;