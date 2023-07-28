const express = require("express");
const router = express();
const cityModel = require("../models/city");
const bodyparser = require("body-parser");
router.use(bodyparser.json());


router.post("/city",async (req, res) => {
    try {
        citydata = await new cityModel({
          city: req.body.city,
         country_id:req.body.countryid,
          coordinates:req.body.coordinates
        });
      await citydata.save();
      // console.log(citydata);
      res.send({
        success: true,
        citydata,
        message: "city add succesfully",
      });
    } catch (error) {
      console.log(error);
      if(error.keyPattern){
        if (error.keyPattern.city) {
          return res.status(500).send({
            success: false,
            message: "city already exist!!!!!!!!!!!!!!!!!!!!" 
          })
        } 
      }
    
      res.status(500).send(error)
    }
  });


  router.get("/city", async (req, res) => {
    try {
      // const citydata = await cityModel.find();
      const cities = await cityModel.aggregate([
        {
          $lookup: {
            from: 'countries',
            foreignField: '_id',
            localField: 'country_id',
            as: 'countrydata'
          }
        },
        {
          $unwind: '$countrydata'
        }
      ])
      // console.log(cities);
      res.send(cities);
    } catch (error) {
      res.send(error);
    }      
  })

  
router.patch('/city/:id', async(req,res)=>{
  const _id = req.params.id;
  try{
    const updatecity = await cityModel.findByIdAndUpdate(_id, {
      city: req.body.city,
          coordinates:req.body.coordinates
  },{new: true}); 
  await updatecity.save();
    // console.log(updatecity);
    res.send({success : true , updatecity , message: "update city successfull "}); 
  }
  catch(error){ 
    console.log(error);
    if(error.keyPattern){
      if (error.keyPattern.city) {
        return res.status(500).send({
          success: false,
          message: "city already exist!!!!!!!!!!!!!!!!!!!!"
        })
      } 
    }

    return res.status(500).send({success: false})
  }
});
  

// get all cities 



router.get("/allcity", async (req, res) => {
  try {
    const citydata = await cityModel.find();
    // console.log(citydata);
    res.send(citydata);
  } catch (error) {
    res.send(error);
  }      
})

module.exports = router;


