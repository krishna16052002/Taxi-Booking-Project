const express = require("express");
const router = express();
const settingModel = require("../models/setting");
const bodyparser = require("body-parser");
router.use(bodyparser.json());


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
      const settingdata = await settingModel.find();
      res.send(settingdata);
    } catch (error) {
      res.send(error);
    }      
  })
  
router.patch('/setting/:id' , async(req,res)=>{
  const id = req.params.id
  try{
   const updatesetting = await settingModel.findByIdAndUpdate(id , req.body , {new:true});
   await updatesetting.save();
   res.send({success:true, updatesetting ,  message:"update setting successfully"});
  }catch(error){
    console.log(error);
    res.send({success:false , message:"update setting not success"});
  }
})


module.exports = router;