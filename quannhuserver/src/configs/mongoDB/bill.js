const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema
const Bills = new Schema({
    year: {type: String},
    date: {type: Object}, 
    info: {type: Object},
    data: {type: Object}
})
Bills.plugin(AutoIncrement, { inc_field: 'num' });
module.exports =  mongoose.model('Bills', Bills)