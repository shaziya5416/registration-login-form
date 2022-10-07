const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
//process.env.PORT this ensure that jha bhi run ho vha hmare project ko host kr sake || 3000 option
//database schema
const File = require("./models/user_registration");
const {json} =  require('express');

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname , '../public');
const templates_path = path.join(__dirname , '../templates/views');
const partials_path = path.join(__dirname , '../templates/partials');

//database connection
const connectDB = require('./db/conn');
connectDB();

//this is only sufficient for postman to get input from req-->app.use(express.json());
app.use(express.json());
//but to get input withput postman one more line(means we want to get input value so don't show undefined)
app.use(express.urlencoded({extended : false}));

app.use(express.static(static_path));
app.set("view engine" , "hbs");

//instead of looking views now see this(tell to express)
app.set("views" , templates_path);

//register partial files so express js know that partials files also used
hbs.registerPartials(partials_path);

app.get("/" , (req , res)=>{
    res.render("login");
});

// app.get('/home' , (req , res)=>{
//     res.render("home");
// })

app.get('/login' , (req , res)=>{
    res.render("login");
})

app.get('/register' , (req , res)=>{
    res.render("register");
})

app.get('/usersList',async(req,res)=>{
    const allUsers=await File.find()
    res.render("usersList",{allUsers})
})
//create a new user in our database
// req.body.password; password will be name attribute value
app.post("/register" , async (req , res)=>{
    console.log(req.body,"Registration");
    try{
        const password = req.body.password;
        const con_password = req.body.confirmpassword;
        if(password === con_password){
            //store in database
            const registerEmployee = new File({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phoneno : req.body.phoneno,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword,
                gender : req.body.gender,
                role:req.body.role
            });
            const registered = await registerEmployee.save();
            res.status(201).render("login");
        }else{
            res.render("notMatching");
        }
        //console.log(req.body.firstname);
    }catch(error){
        res.send("Either Phone Number Or Email Id Is Matching / Something Went Wrong");
    }
})

//login
app.post("/login" , async(req , res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await File.findOne({email : email});
        console.log(useremail,"Login data");
        const role=useremail.role;
        if (useremail.password === password){ // add admin condition
        if(role==="Admin"){
          res.render("adminloggedin")
        }
        else{
            res.render("loggedin")
        }
    }
        else{
            res.render("invalidPass");
        }
    }catch(err){
        res.status(400).render("invalidPass");
    }
})

//forget Password
app.get("/forgetPassword" , (req , res)=>{
    try{
       res.render("forgetPassword");
    }catch(err){
        res.status(400).render("invalidPass");
    }
})

app.post("/forgetPassword" , async (req , res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const email = req.body.email;
        if( password === confirmpassword ){
            const useremail = await File.findOne({email : email});
            if(useremail){
                const updation = await File.updateOne({email:email} ,{$set : {password:password , confirmpassword:confirmpassword}});
                res.render("passUpdated");
            }
            else{
                res.render("emailNotRegister");
            }
        }
        else{
            res.render("notMatching");
        }
    }catch(err){
        res.status(400).send("Invalid Email Or Password");
    }
})


//can not because we want to host this
app.listen(port , ()=>{
    console.log(`server is running at port number ${port}`);
});