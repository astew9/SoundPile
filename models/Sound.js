const mongoose = require('mongoose');
Schema = mongoose.Schema;

let SoundSchema = new Schema({
    title: String,
    soundURL: String,
    dateUploaded: {
        type: Date,
        default: Date.now()
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    }
});
SoundSchema.index({title:'text'});

module.exports = mongoose.model('Sound', SoundSchema);
