const express = require("express");
const session = require("express-session")
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http,{cors:{origin:['http://localhost:4200']}});
const MogodbSession = require("connect-mongodb-session")(session);
const admin = require("./models/admin");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const adminRouter = require("./routers/adminregistration");
const vehicleRouter = require("./routers/vehicle-type");
const countryRouter = require("./routers/country");
const userRouter = require("./routers/user");
const cityRouter = require("./routers/city");
const driverRouter = require("./routers/drivers");
const pricingRouter = require("./routers/vehiclepricing")
const settingRouter = require("./routers/setting");
const createrideRouter = require("./routers/createride");
const path = require('path');
const initializeSocket = require("./routers/socket")


require("./db/conn");
let Port = process.env.PORT || 8080;

app.use(session({secret: 'Your_Secret_Key', resave: false, saveUninitialized: false}))

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use("/admin", adminRouter);
app.use("", vehicleRouter);
app.use("", countryRouter);
app.use("", userRouter);
app.use("", cityRouter);
app.use("", driverRouter);
app.use("", pricingRouter);
app.use("",settingRouter);
app.use("", createrideRouter);


app.use(express.static(path.join(__dirname, '/public')));
// console.log(path.join(__dirname, '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());

initializeSocket(http);

http.listen(Port, function () {
  // console.log(__dirname);
  console.log(`http://localhost:${Port}`);
});



  //  using post method data added in database
  // app.post('/students', (req,res)=>{
  //     console.log(req.body);
  //     const user = new Student(req.body);
  //     user.save().then(()=>{-
  //         res.send(user);
  //     }).catch((err)=>{
  //         res.send(err);
  //     })
  // });
  
  // using async await method create a post
  // app.post('/admindetails', async(req,res)=>{
  //     try{
  //         const user = new admin(req.body);
  //         const crateUser = await user.save();
  //         res.send(user);
  //         res.send(crateUser);
  //     }catch(err){
  //         res.send(err);}
  // });
  // // get data from the database
  // app.get('/admindetails', async(req,res)=>{
  //     try{
  //         const studentsdata = await admin.find();
  //         res.send(studentsdata);
  //     }catch(e){
  //         res.send(e);
  //     }
  // })
  // // get data todatabase to  particular data
  
  // app.get("/admindetails/:id", async(req,res)=>{
  //     try{
  //         const _id  = req.params.id;
  //         const studentData = await admin.findById(_id);
  //         console.log(studentData);
  
  //         if(!studentData){
  //             return res.status(404).send();
  //         }else{
  //             res.send(studentData);
  //         }
  //     }catch(e){
  //         res.send(e);
  //     }
  // })
  
  // // update a record
  // app.patch("/admindetails/:id", async(req,res)=>{
  //     try{
  //         const _id  = req.params.id;
  //         const updatestudent = await admin.findByIdAndUpdate(_id,req.body,{new:true});
  //         res.send(updatestudent);
  //     }catch(e){
  //         return res.status(400).send(e);
  //     }
  // })
  
  // // delete a record
  //  app.delete("/admindetails/:id" , async(req,res)=>{
  //     try{
  //         const _id = req.params.id;
  //         const deletestudent = await admin.findByIdAndDelete(_id,req.body);
  
  //         if(!req.params.id){
  //             return res.status(404).send();
  //         }else{
  //             res.send(deletestudent);
  //         }
  //     }catch(e){
  //         return res.status(500).send(e);
  //     }
  //  })
