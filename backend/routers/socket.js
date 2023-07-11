const express = require("express");
const router = express();
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const socketIo = require('socket.io');
const driverModel = require("../models/driver");
const { mongoose } = require('mongoose')
const createrideModel = require("../models/createride");
const CronJob = require('cron').CronJob;

async function initializeSocket(server) {
  const io = socketIo(server, { cors: { origin: ['http://localhost:4200'] } });

  io.on('connection', (socket) => {
    console.log('Socket connected');

    // Assuming you have a socket instance available

    socket.on("assigndriverdata", async (data) => {
      console.log(data);
      try {
        const city_id = new mongoose.Types.ObjectId(data.cityId);
        const assignService = new mongoose.Types.ObjectId(data.assignService);

        let pricingQuery = driverModel.aggregate([
          // {
          //   $match: {
          //     status: true,
          //     city_id: city_id,
          //     assignService: assignService,
          //   },
          // },
          {
            $lookup: {
              from: "countries",
              foreignField: "_id",
              localField: "country_id",
              as: "countrydata",
            },
          },
          {
            $unwind: "$countrydata",
          },
          {
            $lookup: {
              from: "cities",
              foreignField: "_id",
              localField: "city_id",
              as: "citydata",
            },
          },
          {
            $unwind: "$citydata",
          },
          {
            $lookup: {
              from: "vehicles",
              foreignField: "_id",
              localField: "assignService",
              as: "vehicledata",
            },
          },
          {
            $unwind: {
              path: "$vehicledata",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              status: true,
              city_id: city_id,
              assignService: assignService,
              assign: "0"
            },
          },
        ]);

        const driver = await pricingQuery.exec();

        console.log(driver);

        // Emit the 'assigndriverdatadata' event with the driver data to the client
        io.emit("assigndriverdata", { driver });
      } catch (error) {
        console.error(error);
      }
    });

    // change driverstatus 

    socket.on('changedriverstatus', async (data) => {
      const _id = data.id;
      const status = data.status;
      console.log(data);
      try {
        const updateDriver = await driverModel.findByIdAndUpdate(_id, { status: status }, { new: true });
        await updateDriver.save();
        // console.log(updateDriver);
        // const driver = await driverModel.find({status:true});

        io.emit('driverstatuschanged', { updateDriver, success: true, message: 'update driver successfull' });

        // socket.emit('statuschangeconfirmation', {
        //   success: true,
        //   message: 'Update driver successfull',
        // });
      } catch (error) {
        console.log(error);
        socket.emit('driverstatuschanged', {
          success: false,
          message: 'Toggle not updated',
        });
      }
    });

    //  change vehicle service in driver data 

    socket.on('changevehicletype', async (data) => {
      // console.log(data);
      const _id = data.id
      const assignService = data.assignServices
      try {
        const updatedrivervehicle = await driverModel.findByIdAndUpdate(_id, { assignService: assignService }, { new: true })
        await updatedrivervehicle.save();
        // console.log(updatedrivervehicle);
        io.emit('changevehicletype', { updatedrivervehicle, success: true, message: 'update driver succesfull' })
      } catch (error) {
        console.log(error);
        socket.emit('changevehicletype', { success: false, message: 'update driver is not succesfull' })
      }
    })

    // assign driver in create ride data 

    socket.on('assigndriver', async (data) => {
      console.log(data);
      const _id = data._id;
      const driver_id = data.driver_id;
      try {
        const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "1" }, { new: true });
        await driver.save();
        console.log(driver);
        const ride = await createrideModel.findByIdAndUpdate(_id, { driver_id: driver_id, assigned: "assigning" }, { new: true })
        await ride.save()
        console.log(ride);
        io.emit('assigndriver', { driver });
        io.emit('assigndriver', { ride });
      } catch (error) {
        console.log(error);
        socket.emit('assigndriver', { success: false })
      }


    })

    // const job = new CronJob(
    //   '*/2 * * * * *',
    //   function () {
    //     console.log('You will see this message every 20 seconds');
    //   },
    //   null,
    //   false,
    //   'America/Los_Angeles'
    // );

    socket.on("runningrequest", async () => {
      try {
        let runningrequest = createrideModel.aggregate([
          {
            $match: {
              assigned: "assigning"
            },
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "user_id",
              as: "userdata",
            },
          },
          {
            $unwind: "$userdata",
          },
          {
            $lookup: {
              from: "cities",
              foreignField: "_id",
              localField: "city_id",
              as: "citydata",
            },
          },
          {
            $unwind: "$citydata",
          },
          {
            $lookup: {
              from: "vehicles",
              foreignField: "_id",
              localField: "vehicle_id",
              as: "vehicledata",
            },
          },
          {
            $unwind: "$vehicledata"
          },
          {
            $lookup: {
              from: "drivers",
              foreignField: "_id",
              localField: "driver_id",
              as: "driverdata",
            },
          },
          {
            $unwind: "$driverdata",
          }
        ]);

        const runningrequestdata = await runningrequest.exec();

        console.log(runningrequestdata);

        // Emit the 'runningrequest' event with the driver data to the client
        io.emit("runningrequest", { runningrequestdata });
      } catch (error) {
        console.error(error);
      }
    });

    //  when ride is rejected

    socket.on('riderejected', async (data) => {
      console.log(data);
      const ride_id = data.ride_id;
      const driver_id = data.driver_id;
      try {
        const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "0" }, { new: true });
        await driver.save();
        console.log(driver);
        const ride = await createrideModel.findByIdAndUpdate(ride_id, { driver_id: null, assigned: "pending" }, { new: true })
        await ride.save()
        console.log(ride);
        io.emit('riderejected', { driver });
        io.emit('riderejected', { ride });
      } catch (error) {
        console.log(error);
        socket.emit('riderejected', { success: false })
      }
    })


    socket.on('cancelride', async (data) => {
      console.log(data);
      const ride_id = data.ride_id;
      try {
        const ride = await createrideModel.findByIdAndUpdate(ride_id, { assigned: "cancel" }, { new: true })
        await ride.save();
        console.log(ride);
        io.emit('cancelride', { ride });
      } catch (error) {
        console.log(error);
        socket.emit('cancelride', { success: true })
      }
    })


    // socket.on('ridehistory', async (data) => {
    //   console.log(data);
    //   const paymentoptions = data. cashCard;
    //   const fromdate = data.fromdate;
    //   const todate = data.todate;
    //   const pickupLocation = data.pickupLocation;
    //   const dropoffLocation = data.dropoffLocation;

    //   try {
    //     let ridehistory = createrideModel.aggregate([
    //       {
    //         $match: {
    //           assigned: { $in: ["cancel", "completed"] }
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "users",
    //           foreignField: "_id",
    //           localField: "user_id",
    //           as: "userdata",
    //         },
    //       },
    //       {
    //         $unwind: "$userdata",
    //       },
    //       {
    //         $lookup: {
    //           from: "cities",
    //           foreignField: "_id",
    //           localField: "city_id",
    //           as: "citydata",
    //         },
    //       },
    //       {
    //         $unwind: "$citydata",
    //       },
    //       {
    //         $lookup: {
    //           from: "vehicles",
    //           foreignField: "_id",
    //           localField: "vehicle_id",
    //           as: "vehicledata",
    //         },
    //       },
    //       {
    //         $unwind: "$vehicledata"
    //       },
    //       {
    //         $lookup: {
    //           from: "drivers",
    //           foreignField: "_id",
    //           localField: "driver_id",
    //           as: "driverdata",
    //         },
    //       },
    //       {
    //         $unwind: {
    //           path: "$driverdata",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       }
    //     ]);

    //     const ridehistorydata = await ridehistory.exec();

    //     // console.log(ridehistorydata);

    //     // Emit the 'runningrequest' event with the driver data to the client
    //     io.emit("ridehistory", { ridehistorydata });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

    socket.on('ridehistory', async (data) => {
      console.log(data);
      const paymentOptions = data.cashCard;
      const fromDate = data.fromdate;
      const toDate = data.todate;
      const pickupLocation = data.pickupLocation;
      const dropoffLocation = data.dropoffLocation;
    
      try {
        let rideHistoryQuery = createrideModel.aggregate([
          {
            $match: {
              assigned: { $in: ["cancel", "completed"] }
            }
          },
          // Add other stages for filtering based on parameters
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "user_id",
              as: "userdata"
            }
          },
          {
            $unwind: "$userdata"
          },
          {
            $lookup: {
              from: "cities",
              foreignField: "_id",
              localField: "city_id",
              as: "citydata"
            }
          },
          {
            $unwind: "$citydata"
          },
          {
            $lookup: {
              from: "vehicles",
              foreignField: "_id",
              localField: "vehicle_id",
              as: "vehicledata"
            }
          },
          {
            $unwind: "$vehicledata"
          },
          {
            $lookup: {
              from: "drivers",
              foreignField: "_id",
              localField: "driver_id",
              as: "driverdata"
            }
          },
          {
            $unwind: {
              path: "$driverdata",
              preserveNullAndEmptyArrays: true
            }
          }
        ]);
    
        // Apply filters based on parameters
        if (paymentOptions) {
          rideHistoryQuery = rideHistoryQuery.match({ paymentoption: paymentOptions });
        }
        if (fromDate && toDate) {
          rideHistoryQuery = rideHistoryQuery.match({
            created: {
              $gte: new Date(fromDate),
              $lte: new Date(toDate)
            }
          });
        }
        if (pickupLocation) {
          const regex = new RegExp(pickupLocation, "i");
          rideHistoryQuery = rideHistoryQuery.match({ startlocation: regex });
        }
        if (dropoffLocation) {
          const regex = new RegExp(dropoffLocation, "i");
          rideHistoryQuery = rideHistoryQuery.match({ destinationlocation: regex });
        }
    
        const rideHistoryData = await rideHistoryQuery.exec();
    
        // Emit the filtered ride history data to the client
        io.emit("ridehistory", { ridehistorydata: rideHistoryData });
        console.log(rideHistoryData);
      } catch (error) {
        console.error(error);
      }
    });
    

    socket.on('ridehistorydata', async (data) => {
      const search = data.search;
      let skip = (page - 1) * limit;


      try{
        let query = {};
        if (search){
          query = {
            $or: [
              { startlocation: { $regex: search, $options: "i" } },
              { destinationlocation: { $regex: search, $options: "i" } },
            ],
            assigned: { $in: ["cancel", "completed"] }
          };
        }


        let ridehistory = createrideModel.aggregate([
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "user_id",
              as: "userdata",
            },
          },
          {
            $unwind: "$userdata",
          },
          {
            $lookup: {
              from: "cities",
              foreignField: "_id",
              localField: "city_id",
              as: "citydata",
            },
          },
          {
            $unwind: "$citydata",
          },
          {
            $lookup: {
              from: "vehicles",
              foreignField: "_id",
              localField: "vehicle_id",
              as: "vehicledata",
            },
          },
          {
            $unwind: "$vehicledata"
          },
          {
            $lookup: {
              from: "drivers",
              foreignField: "_id",
              localField: "driver_id",
              as: "driverdata",
            },
          },
          {
            $unwind: {
              path: "$driverdata",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: query }, // Apply search query

        ]);
        const ridehistorydata = await ridehistory.exec();
        console.log(ridehistorydata);
        io.emit("ridehistory", { ridehistorydata });
      }catch(error){
        console.log(error);
        io.emit("ridehistory" , error)
      }
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

  });
}

module.exports = initializeSocket;