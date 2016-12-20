const mongoose = require('mongoose');
Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let AccountSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    profile_pic: String,
    first_name: String,
    last_name: String,
    bio: String,
    sounds: [{
            type: Schema.Types.ObjectId,
            ref: 'Sound'
    }]
});

AccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

AccountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Account', AccountSchema);
