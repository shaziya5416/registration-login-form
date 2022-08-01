const mongoose = require('mongoose');
const url = "mongodb+srv://inshare:dBmi3Hqf65dPFJdJ@cluster0.kbgcr.mongodb.net/inshare?retryWrites=true&w=majority";
function connectDB(){
    //DataBase Connection
    mongoose.connect(url ,
     {useNewUrlParser: true , useUnifiedTopology:true} );
    const connection = mongoose.connection;

    //event listener when db connect
    connection.once('open' , ()=>{
        console.log("DataBase Connected");
    })
}

module.exports = connectDB;

//url is credential  so this will kept into environment variable(env) and then import
// need package .env