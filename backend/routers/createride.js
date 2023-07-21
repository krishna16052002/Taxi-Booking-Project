const express = require('express');
require('dotenv').config();
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const createrideModel = require("../models/createride");
const driverModel = require("../models/driver");
const settingModel = require("../models/setting");
// const accountSid = 'AC061405c02eaa8d6694f85f0f9b20f6e4';
// const authToken = '[444d2165694de70424dbf30769821505]';
// const client = require('twilio')(accountSid, authToken);

const router = express();


// function sendmessage(){
//   client.messages
//     .create({
//       body:'Hello twilio',
//       from: '+14175052749',
//       to: '+918733930293'
//     })
//     .then((message) => console.log(message.sid,"message"))
//     // .done()
//     .catch((error) => {
//       console.log(error);
//     });
//     // .catch((error)=>{
//     //   console.log(error);
//     // })
//   }



function sendmessage() {

  
  try {
    const message = client.messages.create({
      body: 'heyy',
      from: '+14175052749',
      to: '+919484881886'
    });
    console.log(message.sid, 'message');
  } catch (error) {
    console.log('Error sending message:', error);
  }
}


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
    // sendmessage();
  } catch (error) {
    res.send(error);
  }      
})


router.patch('/createride', async (req, res) => {
  let id = req.body._id;
  console.log(req.body);
  const feedback = req.body.feedback
  try {
    const ride = await createrideModel.findByIdAndUpdate(id, {feedback:req.body.feedback} , { new: true })
    console.log(ride);
    await ride.save()
    res.send(ride)
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})




// router.delete("/createride/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const deleteDriver = await createrideModel.findByIdAndDelete(_id, req.body);

//     if (!req.params.id) {
//       return res.status(404).send();
//     } else {
//       res.send({
//         success: true,
//         deleteDriver,
//         message: "delete ride succesful",
//       });
//     }
//   } catch (e) {
//     return res.status(500).send(e);
//   }
// });


// router.patch('/createride/:id', async (req, res) => {
//   let id = req.params.id
//   console.log(req.body);
//   const { driverId } = req.body
//   try {
//     const driver = await driverModel.findByIdAndUpdate(driverId, { assign: "1" }, { new: true });
//     // if (!driver) {
//     //   return res.status(404).send({ message: 'Driver not found...' })
//     // }
//     await driver.save()
//     const ride = await createrideModel.findByIdAndUpdate(id, req.body, { new: true })
//     // console.log(ride);
//     await ride.save()
//     res.send(ride)
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error)
//   }
// })

// // On cancelling ride to be confirm updating driver and ride info
// createRideRouter.patch('/cancelRideToBeComfirmed', async (req, res) => {
//   const id = req.body.id;
//   console.log(req.body);
//   const driverId = req.body.driverId;
//   try {
//     await driverModel.findByIdAndUpdate(driverId, { assign: '0' });
//     const ride = await createRideModel.findByIdAndUpdate(id, { $unset: { driverId: 1 } }, { new: true });
//     await ride.save();
//     res.send(ride)
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error)
//   }
// })


module.exports = router;