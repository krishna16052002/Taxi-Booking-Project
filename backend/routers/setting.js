const express = require("express");
const router = express();
const settingModel = require("../models/setting");
const bodyparser = require("body-parser");
router.use(bodyparser.json());

const fs = require('fs');
const dotenv = require('dotenv');



router.post("/setting", async (req, res) => {
    try {
        let settingdata;
     
        settingdata =  new settingModel({
            maximumstop: req.body.maximumstop,
            driverrequest: req.body.driverrequest
        })

        console.log(settingdata);
       await settingdata.save();
        res.send({
            success: true,
            settingdata,
            message: "add setting successfully ",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({error,message:"please "})
    }
});


// get data from database 

router.get("/setting", async (req, res) => {
    try {
    // console.log("HI")
      const settingdata = await settingModel.find();
      // console.log(settingdata)
      res.send(settingdata);
    } catch (error) {
      res.send(error);
    }      
  })
  
router.patch('/setting' , async(req,res)=>{
  const id = "64941b14a958df739329717f"
  console.log(id);
  console.log(req.body);

  try{

    dotenv.config(); // Load the current .env file
        process.env.ACCOUNTSID = req.body.assountsid;
        process.env.AUTHTOKEN = req.body.authtoken;
        process.env.EMAILUSERNAME = req.body.emailusername;
        process.env.EMAILPASSWORD = req.body.emailpassword;
        const envData = `AUTHTOKEN=${process.env.AUTHTOKEN}\nACCOUNTSID=${process.env.ACCOUNTSID}\nEMAILUSERNAME=${process.env.EMAILUSERNAME}\nEMAILPASSWORD=${process.env.EMAILPASSWORD}`;
        

    fs.writeFileSync('.env', envData, 'utf8');

   const updatesetting = await settingModel.findByIdAndUpdate(id , req.body , {new:true});
   await updatesetting.save();
   res.send({success:true, updatesetting ,  message:"update setting successfully"});
  }catch(error){
    console.log(error);
    res.send({success:false , message:"update setting not success"});
  }
})


// router.patch('/setting', async (req, res) => {
//   const { twilioaccountSid, twilioauthToken } = req.body;

//   try {
//     // Update the environment variables
//     dotenv.config(); // Load the current .env file
//     process.env.TWILIO_ACCOUNT_SID = twilioaccountSid;
//     process.env.TWILIO_AUTH_TOKEN = twilioauthToken;

//     // Update the .env file
//     const envData = Object.keys(process.env)
//       .map((key) => `${key}=${process.env[key]}`)
//       .join('\n');

//     fs.writeFileSync('.env', envData, 'utf8');

//     res.send({ success: true, message: 'Settings updated successfully' });
//   } catch (error) {
//     console.log(error);
//     res.send({ success: false, message: 'Failed to update settings' });
//   }
// });



module.exports = router;