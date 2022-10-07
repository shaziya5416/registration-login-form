

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstname : {
        type: String , 
        required: true
    },
    lastname : {
        type: String , 
        required: true
    },
    email : {
        type: String , 
        required: true,
        unique : true,
    },
    phoneno : {
        type: Number, 
        required: true,
        unique : true,
    },
    password : {
        type: String , 
        required: true
    },
    confirmpassword : {
        type: String , 
        required: true
    },
    gender : {
        type: String , 
        required: true
    },
    role : {
        type: String , 
        required: true
    }
});

//now we need to create a collection model("collection name")

module.exports = mongoose.model("File" , employeeSchema);