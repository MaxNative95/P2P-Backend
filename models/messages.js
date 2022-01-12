const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email es necessary']
    },
    password: {
        type: String,
        required: [true, 'password is necessary']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
});


usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} needs to be unique' });


module.exports = mongoose.model('Usuario', usuarioSchema);