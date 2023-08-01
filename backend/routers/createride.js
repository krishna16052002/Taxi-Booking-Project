const express = require('express');
require('dotenv').config();
const createrideModel = require("../models/createride");
const userModel = require("../models/user")
const pricingModel = require("../models/vehiclepricing");
const { default: mongoose } = require('mongoose');
const router = express();


router.post('/createride', async (req, res) => {
  console.log(req.body);
  try {
    const ride = new createrideModel(req.body)
    await ride.save();
    res.send(ride)
    // sendmessage();
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
})

router.post("/checkuserdetails" , async (req , res)=>{
  console.log(req.body.phonenumber);
  try{
      const userdetails = await userModel.aggregate([{$match : {userphonenumber : req.body.phonenumber}}]);
      console.log(userdetails);
      if(userdetails.length > 0){

        res.send({userdetails , success:true , message : "user avaliable "})
      }else{
        res.send({success:false , message : "User Not Avaliable "})
      }
  }catch(error){
    console.log(error);
  }
})


router.post("/checkvehiclepricing" , async(req , res)=>{
  console.log(req.body.city_id);
  city_id = new mongoose.Types.ObjectId(req.body.city_id)
  try {
    const pricingdetails = await pricingModel.aggregate([{$match : {city_id : city_id}}]);
    console.log(pricingdetails)
    if(pricingdetails.length > 0){
      res.send({pricingdetails , success :true , message : "Your Entered City Pricing Avaliable "})
    }else{
      res.send({success : false , message : " Pricing Not Available "})
    }
  }catch (error ){
    console.log(error)
  }
})

router.get("/createride", async (req, res) => {
  try {
    // const citydata = await cityModel.find();
    const createride = await createrideModel.aggregate([
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'user_id',
          as: 'usersdata'
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
        $lookup: {
          from: 'drivers',
          foreignField: '_id',
          localField: 'driver_id',
          as: 'driverdata'
        }
      },
      {
        $unwind: '$usersdata'
      },
      {
        $unwind: '$citydata'
      },
      {
        $unwind: '$vehicledata'
      },
      {
        $unwind: {
          path: "$driverdata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          assigned: {$in : [ "pending" , "rejected" , "assigning"]},
          status : {$in :[0 , 2 , 1]},
        }
      }
    ]) 
    // console.log(createride);
    res.send(createride);
  } catch (error) {
    res.send(error);
  }      
})


router.patch('/createride', async (req, res) => {
  let id = req.body._id;
  console.log(req.body);
  const feedback = req.body.feedback
  try {
    const ride = await createrideModel.findById(id)
    console.log(ride);
    // const ride = await createrideModel.findByIdAndUpdate(id, {feedback:req.body.feedback} , { new: true })
    // console.log(ride);
    ride.feedback = req.body.feedback
    await ride.save()
    res.send(ride)
  } catch (error) {
    // console.log(error);
    res.send(error)
  }
})

router.get("/downloadcsv", async (req, res) => {
  try {
    // const citydata = await cityModel.find();
    const createride = await createrideModel.aggregate([
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'user_id',
          as: 'usersdata'
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
        $lookup: {
          from: 'drivers',
          foreignField: '_id',
          localField: 'driver_id',
          as: 'driverdata'
        }
      },
      {
        $unwind: '$usersdata'
      },
      {
        $unwind: '$citydata'
      },
      {
        $unwind: '$vehicledata'
      },
      {
        $unwind: {
          path: "$driverdata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          status : {$in :[7 , 8]},
        }
      }
    ]) 
    // console.log(createride);
    res.send(createride);
  } catch (error) {
    res.send(error);
  }      
})

module.exports = router;