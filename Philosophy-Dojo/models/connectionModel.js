const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionsSchema = new Schema({
    topic: {type: String, required: [true, 'Topic is required']},
    title: {type: String, required: [true, 'Title is required']},
    hostname: {type: String, required: [true, 'Hostname is required']},
    author: {type: Schema.Types.ObjectId, ref:'User'},
    description: {type: String, required: [true, 'Description is required'], minLength: [10, 'the content should have at least 10 characters']},
    date: {type: String, required: [true, 'Description is required']},
    startTime: {type: String, required: [true, 'Start time is required']},
    endTime: {type: String, required: [true, 'End time is required']},
    image: {type: String, required: [true, 'Image URL is required']},
    location: {type: String, required: [true, 'Place is required']}
},
{timestamps: true}
);

//collection name is connections in the database
module.exports = mongoose.model('Connection', connectionsSchema);