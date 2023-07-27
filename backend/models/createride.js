const mongoose = require("mongoose");
const status = {
  pending: 0,
  assigning: 1,
  rejected: 2,
  accepted: 3,
  arrived: 4,
  picked: 5,
  started: 6,
  completed: 7,
  cancel : 8 ,
  hold: 9
};

const createrideSchema = mongoose.Schema(
  { 
    paymentoption: {},
    ridetime: {},
    date: {},
    time: {},
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "vehicle",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cities",
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
    },
    startlocation: {},
    destinationlocation: {},
    waypoints: {},
    totaldistance: {},
    totaltime: {},
    estimatetime: {},
    estimatefare: {},
    assigned:{ type:String, default:"pending"},
    created:{type:String,default:Date.now()},
    nearest :{
      type:Boolean
    },
    assigndriverarray : { type:Array , defalut : []  },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7 , 8 , 9],
      default: 0,
    },
    feedback:{
      type:String,
      default:"",
    }
  }
);

const createride = mongoose.model("createride", createrideSchema);

module.exports = createride;