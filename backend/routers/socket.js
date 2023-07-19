const express = require("express");
const router = express();
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const socketIo = require('socket.io');
const driverModel = require("../models/driver");
const { mongoose } = require('mongoose')
const createrideModel = require("../models/createride");
const { from } = require("nodemailer/lib/mime-node/le-windows");
const CronJob = require('cron').CronJob;
const cron = require('node-cron');
const nearestdriver = false;

async function initializeSocket(server) {
  const io = socketIo(server, { cors: { origin: ['http://localhost:4200'] } });

  io.on('connection', (socket) => {
    console.log('Socket connected');


    // Assuming you have a socket instance available

    socket.on("assigndriverdata", async (data) => {
      // console.log(data);
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

        // console.log(driver);

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
      // console.log(data);
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
        // console.log(error);
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
        // console.log(error);
        socket.emit('changevehicletype', { success: false, message: 'update driver is not succesfull' })
      }
    })

// crone 

    const job = cron.schedule('* * * * * *', async () => {

      const ride = await createrideModel.find({ assigned: "assigning", status : 1  ,  nearest: false });
      const ridenearestdata = await createrideModel.find({ assigned: "assigning", status : 1  , nearest: true });
      // console.log(ride , "rideeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      // console.log(ridenearestdata , "nearesttttttttttttttttttttttt");
      if (ride.length > 0) {
        // console.log("hellodfvgbhnjmkmn");
        for (const data of ride) {
          if (data.created) {
            job.start();
            // console.log('Cron job started.');
            const currentTime = new Date();
            // console.log(currentTime.getTime());
            const elapsedTimeInSeconds = Math.floor((currentTime.getTime() - data.created) / 1000);
            console.log(elapsedTimeInSeconds);
            if (elapsedTimeInSeconds >= 10) {
              const result1 = await driverModel.findByIdAndUpdate(data.driver_id, { assign: "0" }, { new: true });
              io.emit('riderejected', result1);


              const result = await createrideModel.findByIdAndUpdate(data._id, { driver_id: null, assigned: "pending" , status : 0 }, { new: true });
              io.emit('riderejected', result);
              console.log('Cron job ended.');

            } else {
              // console.log("hello");
            }
          }
        }
      }
      if (ridenearestdata.length > 0) {
        for (const data of ridenearestdata) {
          const currentTime = new Date();
          // console.log(data.created);
          // console.log(currentTime.getTime());
          const elapsedTimeInSeconds = Math.floor((currentTime.getTime() - data.created) / 1000);
          // console.log(elapsedTimeInSeconds);
          if (elapsedTimeInSeconds >= 10) {
            // console.log("hello");
            const city_id = new mongoose.Types.ObjectId(data.city_id);
            const vehicle_id = new mongoose.Types.ObjectId(data.vehicle_id);
            const assigneddrivers = [...new Set(data.assigndriverarray)];
            let alldrivers = driverModel.aggregate([
              {
                $match: {
                  status: true,
                  city_id: city_id,
                  assignService: vehicle_id,
                  assign: "0",
                  _id: { $nin: assigneddrivers }
                },
              },
            ]);

            const pendingdriver = await alldrivers.exec();
            // console.log(pendingdriver.length);
            // const array = pendingdriver

            if (pendingdriver.length > 0) {
              const randomIndex = Math.floor(Math.random() * pendingdriver.length);
              const randomObject = pendingdriver[randomIndex];

              // console.log(randomObject._id);
              const driver = await driverModel.findByIdAndUpdate(randomObject._id, { assign: "1" }, { new: true });
              const driverdata = await driverModel.findByIdAndUpdate(data.driver_id, { assign: "0" }, { new: true });

              const result = await createrideModel.findByIdAndUpdate(data._id, { $addToSet: { assigndriverarray: randomObject._id }, created: Date.now(), driver_id: randomObject._id }, { new: true });
              // console.log(result);
              io.emit('afterselectdriver', driverdata, driver, result)
            }
            else {
              // console.log("pendingdrivers updatesssssssssssssssssssssssssssssssss ");
              // const city_id = new mongoose.Types.ObjectId(data.city_id);
              // const vehicle_id = new mongoose.Types.ObjectId(data.vehicle_id);
              // const assigneddrivers = [...new Set(data.assigndriverarray)];
              // let alldriversdatasdfghjkmnjhg = driverModel.aggregate([
              //   {
              //     $match: {
              //       status: true,
              //       city_id: city_id,
              //       assignService: vehicle_id,
              //       assign: "1",
              //     },
              //   },
              // ]);

              // const pendingdriverdfghjksdfghj = await alldriversdatasdfghjkmnjhg.exec();
              // console.log(pendingdriverdfghjksdfghj);
              // for (const data of pendingdriverdfghjksdfghj) 
              // { 
              //   const driver = await driverModel.findByIdAndUpdate(data._id, { assign: "0" }, { new: true });
              //  }

              const driverdata = await driverModel.findByIdAndUpdate(data.driver_id, { assign: "0" }, { new: true });
              const result = await createrideModel.findByIdAndUpdate(data._id, { created: Date.now(), assigndriverarray: [], nearest: false, assigned: "pending",  status : 0 ,  driver_id: null }, { new: true });
              io.emit('afternulldriverdata', driverdata, result)
            }
          }


        }
      }
    })

    // assign driver in create ride data 

    socket.on('assigndriver', async (data) => {
      // console.log(data);
      const _id = data._id;
      const driver_id = data.driver_id;
      try {
        const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "1" }, { new: true });
        await driver.save();
        // console.log(driver);
        const ride = await createrideModel.findByIdAndUpdate(_id, { driver_id: driver_id, assigned: "assigning", status : 1 ,  nearest: false, created: Date.now() }, { new: true })
        await ride.save()
        // console.log(ride);
        io.emit('assigndriver', { driver });
        io.emit('assigndriver', { ride });
        // startCronJob(driver_id , _id );
      } catch (error) {
        // console.log(error);
        socket.emit('assigndriver', { success: false })
      }


    })

    // assign nearest driver 

    socket.on("assignnearestdriverdata", async (data) => {
      console.log(data);
      try {
        const city_id = new mongoose.Types.ObjectId(data.cityId);
        const assignService = new mongoose.Types.ObjectId(data.assignService);

        let assignnearestdriverdata = driverModel.aggregate([
          {
            $match: {
              status: true,
              city_id: city_id,
              assignService: assignService,
              assign: "0"

            },
          },
        ]);

        const driverdata = await assignnearestdriverdata.exec();

        // console.log(driverdata);
        const firstdriver = driverdata[0]
        console.log(firstdriver._id);

        const driver = await driverModel.findByIdAndUpdate(firstdriver._id, { assign: "1" }, { new: true });
        await driver.save();
        // // console.log(driver);
        const ride = await createrideModel.findByIdAndUpdate(data._id, { driver_id: firstdriver._id, assigned: "assigning", status : 1  ,  nearest: true, assigndriverarray: firstdriver._id, created: Date.now() }, { new: true })
        await ride.save()


        // Emit the 'assigndriverdatadata' event with the driver data to the client
        io.emit("afterassignnearestdriverdata", { driverdata });
      } catch (error) {
        console.error(error);
      }
    });


    socket.on("runningrequest", async () => {
      try {
        let runningrequest = createrideModel.aggregate([
          {
            $match: {
              assigned: {$in : ["assigning" , "accepted" , "arrived", "picked", "started" ]},
              status : {$in : [0 , 3 , 4 , 5 , 6 ]}
            
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

        // console.log(runningrequestdata);

        // Emit the 'runningrequest' event with the driver data to the client
        io.emit("runningrequest", { runningrequestdata });
      } catch (error) {
        console.error(error);
      }
    });

    //  when ride is rejected

    socket.on('riderejected', async (data) => {
      // console.log(data);
      const ride_id = data.ride_id;
      const driver_id = data.driver_id;
      try {
        const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "0" }, { new: true });
        await driver.save();
        // console.log(driver);
        const ride = await createrideModel.findByIdAndUpdate(ride_id, { driver_id: null, assigned: "rejected" , status : 2 ,  assigndriverarray : [] }, { new: true })
        await ride.save()
        // console.log(ride);
        io.emit('riderejected', { driver });
        io.emit('riderejected', { ride });
      } catch (error) {
        // console.log(error);
        socket.emit('riderejected', { success: false })
      }
    })


    socket.on('cancelride', async (data) => {
      // console.log(data);
      const ride_id = data.ride_id;
      // console.log(ride_id);
      try {
        const ride = await createrideModel.findByIdAndUpdate(ride_id, { assigned: "cancel" , status : 8 }, { new: true })
        await ride.save();
        // console.log(ride);
        io.emit('cancelride', { ride });
      } catch (error) {
        // console.log(error);
        socket.emit('cancelride', { success: true })
      }
    })

    // ride accepted 
    // socket.on('accepted', async (data) => {
    //   const ride_id = data.ride_id;
    //   const driver_id = data.driver_id;
    //   try {
    //     const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "1" }, { new: true });
    //     await driver.save();
    //     // console.log(driver);
    //     const ride = await createrideModel.findByIdAndUpdate(ride_id, { driver_id: driver_id, assigned: "accepted" , status : 3}, { new: true })
    //     await ride.save()
    //     io.emit('afteraccepted', driver, ride);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })

    // // ride arrived
    // socket.on('arrived', async (data) => {
    //   const ride_id = data.ride_id;
    //   const driver_id = data.driver_id;
    //   try {
    //     const ride = await createrideModel.findByIdAndUpdate(ride_id, { assigned: "arrived" , status : 4 }, { new: true })
    //     await ride.save()
    //     io.emit('afterarrived', ride);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })

    // // ride picked 
    // socket.on('picked', async (data) => {
    //   const ride_id = data.ride_id;
    //   try {
    //     const ride = await createrideModel.findByIdAndUpdate(ride_id, { assigned: "picked" , status : 5}, { new: true })
    //     await ride.save()
    //     io.emit('afterarrived', ride);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })

    // // ride started 
    // socket.on('started', async (data) => {
    //   const ride_id = data.ride_id;
    //   try {
    //     const ride = await createrideModel.findByIdAndUpdate(ride_id, { assigned: "started" , status : 6 }, { new: true })
    //     await ride.save()
    //     io.emit('afterstarted', ride);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })

    // // ride complete 

    // socket.on('Completed', async (data) => {
    //   const ride_id = data.ride_id;
    //   const driver_id = data.driver_id;
    //   try {
    //     const driver = await driverModel.findByIdAndUpdate(driver_id, { assign: "0" }, { new: true });
    //     await driver.save();
    //     // console.log(driver);
    //     const ride = await createrideModel.findByIdAndUpdate(ride_id, { driver_id: null , assigned: "Completed" , status : 7 }, { new: true })
    //     await ride.save()
    //     io.emit('afteraccepted', driver, ride);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })


    socket.on('ridehistory', async (data) => {
      // console.log(data);
      const rideHistoryData = data.data;
      // console.log(rideHistoryData);

      // Accessing individual properties
      const vehicleId = rideHistoryData.vehicle_id;
      // console.log(vehicleId);
      const paymentOptions = rideHistoryData.cashCard;
      // console.log(paymentOptions);
      const fromDate = rideHistoryData.fromdate;
      const toDate = rideHistoryData.todate;
      const pickupLocation = rideHistoryData.pickupLocation;
      const dropoffLocation = rideHistoryData.dropoffLocation;

      // console.log(paymentOptions , fromDate , toDate , pickupLocation , dropoffLocation)

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
        // if(vehicleId){
        //   rideHistoryQuery = rideHistoryQuery.match({vehicle_id : vehicleId });
        // }
        // Apply filters based on parameters

        if (paymentOptions) {
          rideHistoryQuery = rideHistoryQuery.match({ paymentoption: paymentOptions });
        }
        if (fromDate && toDate) {
          rideHistoryQuery = rideHistoryQuery.match({
            date: {
              $gte: fromDate,
              $lte: toDate
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
        // console.log(rideHistoryData);
      } catch (error) {
        console.error(error);
      }
    });



    // socket.on('ridehistory', async (data) => {
    //   console.log(data);
    //   const rideHistoryData = data.data;
    //   console.log(rideHistoryData);

    //   // Accessing individual properties
    //   const vehicleId = rideHistoryData.vehicle_id;
    //   console.log(vehicleId);
    //   const paymentOptions = rideHistoryData.cashCard;
    //   console.log(paymentOptions);
    //   const fromDate = rideHistoryData.fromdate;
    //   const toDate = rideHistoryData.todate;
    //   const pickupLocation = rideHistoryData.pickupLocation;
    //   const dropoffLocation = rideHistoryData.dropoffLocation;

    //   try {
    //     let rideHistoryQuery = createrideModel.aggregate([
    //       {
    //         $match: {
    //           assigned: { $in: ["cancel", "completed"] },
    //           $or: [
    //             { paymentoption: { $regex: paymentOptions, $options: "i" } },
    //             {
    //               created: {
    //                 $gte: fromDate ? new Date(fromDate) : new Date(0),
    //                 $lte: toDate ? new Date(toDate) : new Date()
    //               }
    //             },
    //             pickupLocation
    //               ? { startlocation: { $regex: pickupLocation, $options: "i" } }
    //               : {},
    //             dropoffLocation
    //               ? { destinationlocation: { $regex: dropoffLocation, $options: "i" } }
    //               : {}
    //           ]
    //         }
    //       },
    //       {
    //         $facet: {
    //           filteredData: [
    //             {
    //               $lookup: {
    //                 from: "users",
    //                 localField: "user_id",
    //                 foreignField: "_id",
    //                 as: "userdata"
    //               }
    //             },
    //             {
    //               $unwind: "$userdata"
    //             },
    //             {
    //               $lookup: {
    //                 from: "cities",
    //                 localField: "city_id",
    //                 foreignField: "_id",
    //                 as: "citydata"
    //               }
    //             },
    //             {
    //               $unwind: "$citydata"
    //             },
    //             {
    //               $lookup: {
    //                 from: "vehicles",
    //                 localField: "vehicle_id",
    //                 foreignField: "_id",
    //                 as: "vehicledata"
    //               }
    //             },
    //             {
    //               $unwind: "$vehicledata"
    //             },
    //             {
    //               $lookup: {
    //                 from: "drivers",
    //                 localField: "driver_id",
    //                 foreignField: "_id",
    //                 as: "driverdata"
    //               }
    //             },
    //             {
    //               $unwind: {
    //                 path: "$driverdata",
    //                 preserveNullAndEmptyArrays: true
    //               }
    //             },
    //             {
    //               $match: {
    //                 $or: [
    //                   { paymentoption: paymentOptions },
    //                   {
    //                     created: {
    //                       $gte: fromDate ? new Date(fromDate) : new Date(0),
    //                       $lte: toDate ? new Date(toDate) : new Date()
    //                     }
    //                   },
    //                   pickupLocation
    //                     ? { startlocation: { $regex: pickupLocation, $options: "i" } }
    //                     : {},
    //                   dropoffLocation
    //                     ? { destinationlocation: { $regex: dropoffLocation, $options: "i" } }
    //                     : {}
    //                 ]
    //               }
    //             }
    //           ],
    //           totalCount: [
    //             {
    //               $match: {
    //                 assigned: { $in: ["cancel", "completed"] }
    //               }
    //             },
    //             {
    //               $count: "count"
    //             }
    //           ]
    //         }
    //       }

    //     ]);

    //     const rideHistoryResult = await rideHistoryQuery.exec();
    //     const filteredData = rideHistoryResult[0].filteredData;
    //     const totalCount = rideHistoryResult[0].totalCount;

    //     io.emit("ridehistory", { ridehistorydata: filteredData, totalCount });
    //     console.log(filteredData);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });


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



    // socket.on('ridehistorydata', async (data) => {
    //   const search = data.search;
    //   let skip = (page - 1) * limit;


    //   try {
    //     let query = {};
    //     if (search) {
    //       query = {
    //         $or: [
    //           { startlocation: { $regex: search, $options: "i" } },
    //           { destinationlocation: { $regex: search, $options: "i" } },
    //         ],
    //         assigned: { $in: ["cancel", "completed"] }
    //       };
    //     }


    //     let ridehistory = createrideModel.aggregate([
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
    //       },
    //       { $match: query }, // Apply search query

    //     ]);
    //     const ridehistorydata = await ridehistory.exec();
    //     // console.log(ridehistorydata);
    //     io.emit("ridehistory", { ridehistorydata });
    //   } catch (error) {
    //     // console.log(error);
    //     io.emit("ridehistory", error)
    //   }
    // })


    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

  });
}

module.exports = initializeSocket;