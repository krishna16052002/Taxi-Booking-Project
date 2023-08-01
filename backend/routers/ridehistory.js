const express = require('express');
require('dotenv').config();
const createrideModel = require("../models/createride");
const { default: mongoose } = require('mongoose');
const router = express();

socket.on('ridehistory', async (data) => {
    // console.log(data);
    const rideHistoryData = data.data;
    const status = rideHistoryData.status;
    // console.log(status);
    // const vehicleId = new mongoose.Types.ObjectId(rideHistoryData.vehicle_id);
    const vehicleId = rideHistoryData.vehicle_id;
    // console.log(vehicleId);
    const paymentOptions = rideHistoryData.cashCard;
    const fromDate = rideHistoryData.fromdate;
    const toDate = rideHistoryData.todate;
    const pickupLocation = rideHistoryData.pickupLocation;
    // console.log(pickupLocation);
    const dropoffLocation = rideHistoryData.dropoffLocation;
    // console.log(dropoffLocation);

    try {
      const pipeline = [
        {
          $match: {
            assigned: { $in: ["cancel", "completed"] }
          }
        },
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
      ];

      // Construct the $match stages based on provided filter parameters
      if (paymentOptions) {
        pipeline.push({
          $match: { paymentoption: paymentOptions }
        });
      }
      if (fromDate && toDate) {
        pipeline.push({
          $match: { date: { $gte: fromDate, $lte: toDate } }
        });
      }
      if (pickupLocation) {
        pipeline.push({
          $match: { startlocation: { $regex: pickupLocation, $options: "i" } }
        });
      }

      if (dropoffLocation) {
        pipeline.push({
          $match: { destinationlocation: { $regex: dropoffLocation, $options: "i" } }
        });
      }

      if (status) {
        pipeline.push({
          $match: { assigned: status }
        });
      }


      if (vehicleId && vehicleId.trim() !== '') {
        pipeline.push({
          $match: { vehicle_id: new mongoose.Types.ObjectId(vehicleId) }
        });
      }


      const rideHistoryData = await createrideModel.aggregate(pipeline).exec();

      // Emit the filtered ride history data to the client
      io.emit("ridehistory", { ridehistorydata: rideHistoryData });
    } catch (error) {
      console.error(error);
    }
  });