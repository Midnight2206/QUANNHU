const mongoose = require('mongoose')
async function mgconnect(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/quannhu');
        console.log('Connect Successfully')
    } catch(err) {
        console.log('Connect Fail')
    }
}

module.exports = {mgconnect}