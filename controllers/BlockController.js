
const Block = require("../models/Block");
const BlockKargrohState = require("../models/BlockKargrohState");
const Kargroh = require("../models/Kargroh");

const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

exports.blocks = function (req, res) {

    let instId = req.params.instId;

    sequelize.query("select * from blocks where instruction_id = ?", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [instId]
    }).then(tmp => {

        for(let i = 0; i < tmp.length; i++) {

            let users = [];
            let counter = 0;

            sequelize.query("select concat(first_name, ' ', last_name) as n from kargroh, users where name = ? and users.id = user_id", {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [tmp[i].default_kargroh]
            }).then(tmpUsers => {
                for(let j = 0; j < tmpUsers.length; j++) {
                    users[counter++] = tmpUsers[j].n;
                }

                sequelize.query("select concat(u.first_name, ' ', u.last_name) as n from kargroh k, users u, block_kargroh_states b where k.name = b.kargroh and b.block_id = ? and u.id = k.user_id", {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: [tmp[i].id]
                }).then(tmpUsers2 => {
                    for(let j = 0; j < tmpUsers2.length; j++) {
                        users[counter++] = tmpUsers2[j].n;
                    }

                    tmp["users"] = user;

                    // res.render('blocks', [
                    //     'blocks': tmp
                    // ]);
                });
            });
        }
    })

};