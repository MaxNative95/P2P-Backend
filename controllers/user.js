const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');


const userController = (req, res, next) => {
    try {
        return res.send('ok');
    } catch (error) {
        console.log(error);
    }
};

module.exports = userController;