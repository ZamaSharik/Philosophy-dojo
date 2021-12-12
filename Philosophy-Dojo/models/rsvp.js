const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: {type: String, required: [true, 'Status is required']},
    userID: {type: Schema.Types.ObjectId, ref: 'User'},
    connectionId: {type: Schema.Types.ObjectId, ref: 'Connection'}
},
{timestamps:true}
);

//collection name is 
module.exports = mongoose.model('RSVP', rsvpSchema);