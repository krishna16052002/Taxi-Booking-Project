const express = require("express");
const router = express();
const admin = require("../models/admin");
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const jwt = require("jsonwebtoken");
router.post("/admindetails", async (req, res) => {
  console.log("called");
  // try{
  //     const user = new admin(req.body);
  //     const createUser = await user.save();
  //     res.send(user);
  //     res.send(createUser);
  // }catch(err){
  //     res.send(err);}
  try {
    const admindata = new admin({
      adminname: req.body.adminname,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(admindata);
    let payload = { subject: admindata._id };
    let token = jwt.sign(payload, "secretKey");
    admindata.token = token
    const adminalldata = await admindata.save();
    // console.log(adminalldata);
    res.send({ token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/loginadmindetails", async (req, res) => {
  // console.log('pp');
  try {
    let admindata = req.body;
    const admindetails = await admin.findOne({ email: admindata.email }).exec();
    if (!admindetails) {
      res.send({success: false, message: 'Invalid email'});
    } else {
      if (admindetails.password !== admindata.password) {
        res.send({success: false, message: 'Invalid password'});
      } else {
        let payload = { subject: admindetails._id };
        let token = jwt.sign(payload, "secretKey");
        admindetails.token = token 
        await admindetails.save();
        res.send({ success: true ,token });
        // res.send(admindetails);
      }
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send("Internal server error");
  }
});

// get data from the database
router.get("/admindetails", async (req, res) => {
  try {
    const studentsdata = await admin.find();
    res.send(studentsdata);
  } catch (e) {
    res.send(e);
  }
});
// get data todatabase to  particular data

router.get("/admindetails/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const studentData = await admin.findById(_id);
    // console.log(studentData);

    if (!studentData) {
      return res.status(404).send();
    } else {
      res.send(studentData);
    }
  } catch (e) {
    res.send(e);
  }
});

// update a record
router.post("/admindetails/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    // console.log(typeof id);
    // console.log(req.body, "hhhh");
    const updatestudent = await admin.findByIdAndUpdate(_id, req.body);
    await updatestudent.save();
    // console.log(updatestudent);
    res.send(updatestudent);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

// delete a record
router.delete("/admindetails/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deletestudent = await admin.findByIdAndDelete(_id, req.body);

    if (!req.params.id) {
      return res.status(404).send();
    } else {
      res.send(deletestudent);
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
// router.post("/loginadmindetails", async (req, res) => {
//   let admindata = req.body;
//   admin.findOne({ email: admindata.email }, (error, admindetails) => {
//     if(error){
//       console.log(error);
//     }else{
//       if(!admindetails){
//         res.status(401).send("invalid email");
//       }else{
//         if(admindetails.password!== admindata.password){
//           res.status(401).send("invalid");
//         }else{
//           res.send(admindetails);
//         }
//       }
//     }
//   });
// });
