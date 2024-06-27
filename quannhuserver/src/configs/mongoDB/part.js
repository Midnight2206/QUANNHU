const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Parts = new Schema({
    name: {type: String, unique: true}
})
module.exports =  mongoose.model('Parts', Parts)