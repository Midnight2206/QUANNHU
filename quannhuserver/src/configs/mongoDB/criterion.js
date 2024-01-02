const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Criterion = new Schema({
    year: {type: String, unique: true}, 
    data: {type: Object}
})
module.exports =  mongoose.model('Criterion', Criterion)