const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId : { type : String, required : true, index : true},
    title : { type : String, required : true, trim: true, maxlength: 100},
    description : { type : String, trim : true, maxlength : 500, default : ''},
    dueDate : {type : Date, required: true},
    status : { type : String, enum : ['pending', 'completed'], default : 'pending'},
},
{timestamps: true});

module.exports = mongoose.model('Task', taskSchema);