const  mongoose  = require("mongoose");

const settingSchema = new mongoose.Schema({

    maximumstop:{
        type:Number
    },
    driverrequest:{
        type:Number
    },
    assountsid:{},
    authtoken:{},
    emailusername :{},
    emailpassword:{},
    secreatkey:{},
    publickey:{}
})

const setting = mongoose.model('setting',settingSchema)
module.exports = setting;








