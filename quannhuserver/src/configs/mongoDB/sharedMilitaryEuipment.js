const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SharedMilitaryEquipment = new Schema({
    name: {type: String, unique: true}, 
    unit: {type: String},
    size: {type: Object}
})
module.exports =  mongoose.model('SharedMilitaryEquipment', SharedMilitaryEquipment)