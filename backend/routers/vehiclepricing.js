const express = require("express");
const router = express();
const pricingModel = require("../models/vehiclepricing");
const bodyparser = require("body-parser");
router.use(bodyparser.json());


router.post("/vehiclepricing", async (req, res) => {
  console.log(req.body)
    try {
      
        let pricingdata;
     
            pricingdata =  new pricingModel({
              country_id: req.body.country_id,
              city_id: req.body.city_id,
              vehicle_id: req.body.vehicle_id,
              driverprofit: req.body.driverprofit,
              minfare: req.body.minfare,
              distanceforbaseprice: req.body.distanceforbaseprice,
              baseprice: req.body.baseprice,
              priceperunitdistance: req.body.priceperunitdistance,
              priceperunittime: req.body.priceperunittime,
              maxspace: req.body.maxspace
            })

       await pricingdata.save();
        console.log(pricingdata);
        res.send({
            success: true,
            pricingdata,
            message: "add pricing successfully ",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
});

// get the data 

router.get("/vehiclepricing", async (req, res) => {
  try {
    // const citydata = await cityModel.find();
    const vehiclepricing = await pricingModel.aggregate([
      {
        $lookup: {
          from: 'countries',
          foreignField: '_id',
          localField: 'country_id',
          as: 'countrydata'
        }
      },
      {
        $lookup: {
          from: 'cities',
          foreignField: '_id',
          localField: 'city_id',
          as: 'citydata'
        }
      },
      {
        $lookup: {
          from: 'vehicles',
          foreignField: '_id',
          localField: 'vehicle_id',
          as: 'vehicledata'
        }
      },
      {
        $unwind: '$countrydata'
      },
      {
        $unwind: '$citydata'
      },
      {
        $unwind: '$vehicledata'
      }
    ])
    console.log(vehiclepricing);
    res.send(vehiclepricing);
  } catch (error) {
    res.send(error);
  }      
})

// // update user 
router.patch('/vehiclepricing/:id', async(req,res)=>{
    const _id = req.params.id;
    try{
      const updatePricing = await pricingModel.findByIdAndUpdate(_id, {
        country_id: req.body.country_id,
        city_id: req.body.city_id,
        vehicle_id: req.body.vehicle_id,
        driverprofit: req.body.driverprofit,
        minfare: req.body.minfare,
        distanceforbaseprice: req.body.distanceforbaseprice,
        baseprice: req.body.baseprice,
        priceperunitdistance: req.body.priceperunitdistance,
        priceperunittime: req.body.priceperunittime,
        maxspace: req.body.maxspace
    },{new: true}); 
  
    await updatePricing.save();
      // console.log(updateUser);
      res.send({ success:true  ,updatePricing , message:"update pricing successfull "}); 
    }
    catch(error){ 
        console.log(error);
        if (error.code === 11000) {
          return res.status(500).send({
            success: false,
            message: "The combination of city and vehicle already exists."
          })
        }else{}
        return res.status(500).send({success: false , error })
      }
  });

//   delete user 
router.delete("/vehiclepricing/:id", async (req, res) => {
    try {
      const _id = req.params.id;
      const deletepricing = await pricingModel.findByIdAndDelete(_id, req.body);
  
      if (!req.params.id) {
        return res.status(404).send();
      } else {
        res.send({success:true,deletepricing, message:"delete pricing details succesful"});
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  router.get("/vehiclepricing/data", async (req, res) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    // If limit is not provided or not a valid number, set it to a default value of 1
    if (!limit || isNaN(limit)) {
      limit = 1;
    }
  
    // If page is not provided or not a valid number, set it to a default value of 1
    if (!page || isNaN(page)) {
      page = 1;
    }
  
    let skip = (page - 1) * limit;
    let totalPage;
    console.log(skip);
    console.log(limit);
  
    try {
      // Retrieve the paginated data using the limit and skip values
      const pricing = await pricingModel.aggregate([
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
        },
        {
          $lookup: {
            from: 'cities',
            foreignField: '_id',
            localField: 'city_id',
            as: 'citydata'
          }
        },
        {
          $unwind: '$citydata'
        },
        {
          $lookup: {
            from: 'vehicles',
            foreignField: '_id',
            localField: 'vehicle_id',
            as: 'vehicledata'
          }
        },
        {
          $unwind: '$vehicledata'
        },
        { $skip: (skip) },{$limit:(limit)}
      ]);
    
      // Retrieve the total count of documents in the collection
      const count = await pricingModel.countDocuments();
  
      // Calculate the total number of pages based on the count and limit
      totalPage = Math.ceil(count / limit);
  
      if (!pricing) {
        return res.send("No pricing found.");
      }
  
      res.send({ pricing, count, totalPage });
    } catch (error) {
      res.status(500).send(error);
    }
  });


  router.get("/vehiclepricing/:city_id", async (req, res) => {
    try {
      const _id = req.params.city_id;
      console.log(_id);
      // const studentData = await pricingModel.find({city_id:_id});
      const pricingData = await pricingModel.find({ city_id: _id })
      .populate('vehicle_id', 'vehiclename')
  
        res.send(pricingData);
        console.log(pricingData);
    
    } catch (e) {
      res.send(e);
      console.log(e);
    }
  });


  
module.exports = router;