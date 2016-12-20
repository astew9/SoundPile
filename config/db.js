const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = () => {
    mongoose.connect('mongodb://root:acceptta9@ds135798.mlab.com:35798/soundpile');

    let database = mongoose.connection;
    database.once('open', (error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log('DB connected!');
    });

    require('./../models/Account');
    require('./../models/Sound');

}
