const express = require("express");
const router = express();
const mongoose = require("mongoose");
const multer = require("multer");
const driverModel = require("../models/driver");
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const nodemailer = require("nodemailer");
const sendMail = async (req, res) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAILUSERNAME,
      pass: process.env.EMAILPASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: 'info@ethereal.email', // sender address
    to: "krishnahothi.elluminatiinc@gmail.com", // list of receivers
    subject: "Driver Registration", // Subject line      
    text: " Driver Registration is succesfullllllllllll", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // res.json(info);
};

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

// Configure multer with the desired storage and file filter
const storage = multer.diskStorage({
  destination: "public/driverprofile",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
});

router.post("/driver", upload.single("image"), async (req, res) => {
  try {
    let driverdata;

    driverdata = new driverModel({
      drivername: req.body.drivername,
      driveremail: req.body.driveremail,
      driverphonenumber: req.body.driverphonenumber,
      country_id: req.body.country_id,
      city_id: req.body.city_id,
      drivercountrycode: req.body.drivercountrycode,
      image: req.file.originalname,
      type:this.type,
    });

    console.log(driverdata);
    await driverdata.save();
    res.send({
      success: true,
      driverdata,
      message: "add driver successfully ",
    });
    sendMail()
  } catch (error) {
    console.log(error);
    if (error.keyPattern) {
      if (error.keyPattern.driveremail) {
        return res.status(500).send({
          success: false,
          message: "email already exist!!!!! ",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "phone number already exist!!!!!",
        });
      }
    }

    res.status(500).send(error);
  }
});

// get the data
router.get("/driver", async (req, res) => {
  try {
    const driverdata = await driverModel.find();
    res.send(driverdata);
  } catch (error) {
    res.send(error);
  }
});

// update user
router.patch("/driver/:id", upload.single("image"), async (req, res) => {
  const _id = req.params.id;
  try {
    const updateDriver = await driverModel.findByIdAndUpdate(
      _id,
      {
        drivername: req.body.drivername,
        driveremail: req.body.driveremail,
        driverphonenumber: req.body.driverphonenumber,
        country_id: req.body.country_id,
        city_id: req.body.city_id,
        drivercountrycode: req.body.drivercountrycode,
        assignService: req.body.assignService,
        status: req.body.status,
      
      },
      { new: true }
    );

    // if (req.file) {
    //   updateUser.image= req.file.originalname
    // }
    await updateDriver.save();
    // console.log(updateDriver);
    res.send({
      success: true,
      updateDriver,
      message: "update driver successfull",
    });
  } catch (error) {
    console.log(error);
    if (error.keyPattern) {
      if (error.keyPattern.driveremail) {
        return res.status(500).send({
          success: false,
          message: "email already exist!!!!! ",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "phone number already exist!!!!!",
        });
      }
    }

    return res
      .status(500)
      .send({ success: false, error, message: " please add driver " });
  }
});
//   delete user
router.delete("/driver/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteDriver = await driverModel.findByIdAndDelete(_id, req.body);

    if (!req.params.id) {
      return res.status(404).send();
    } else {
      res.send({
        success: true,
        deleteDriver,
        message: "delete user succesful",
      });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// for toggle
// router.post("/changeDriverStatus/:id", async (req, res) => {
//   let id = req.params.id;
//   console.log(req.body);
//   try{
//     const updateDriver = await driverModel.findByIdAndUpdate(_id, {
//       status:req.body.status,
//   },{new: true});
//   await updateDriver.save();
//   console.log(updateDriver);
//   res.send({success:true ,updateDriver, message:"successfull"});
//   // try {
//   //   let driver = await driverModel.findByIdAndUpdate(id,,{new: true});
//   //   res.send(driver);
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })

// router.patch("/changedriverstatus", async (req, res) => {
//   const _id = req.body.id;
//   // console.log(req.body);

//   try {
//     const updateDriver = await driverModel.findByIdAndUpdate(
//       _id,
//       {
       
//         status: req.body.status,
//       },
//       { new: true }
//     );
//     await updateDriver.save();
//     console.log(updateDriver);
//     res.send({
//       success: true,
//       updateDriver,
//       message: "update driver successfull",
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send({ success: false, error, message: " toggel not updated  " });
//   }
// });

router.post("/services/:id", async (req, res) => {
  const _id = req.params.id;
  console.log("body log=", req.body);

  try {
    // const updateDriver = await driverModel.findByIdAndUpdate(_id,{ assignService: req.body.assignService },{ new: true });
    const updateDriver = await driverModel.findByIdAndUpdate(_id,req.body,{ new: true });

    // const updateDriver = await driverModel.findByIdAndUpdate(_id, { $set: { assignService: req.body.assignService } }, { new: true });

    // await updateDriver.save();
    console.log("response log=", updateDriver);
    res.send({
      success: true,
      updateDriver,
      message: "update driver successfull",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error, message: " not updated  " });
  }
});

// pagination

// router.get("/driver/driverdata", async (req, res) => {
//   let page = parseInt(req.query.page);
//   let limit = parseInt(req.query.limit);

//   // If limit is not provided or not a valid number, set it to a default value of 1
//   if (!limit || isNaN(limit)) {
//     limit = 1;
//   }

//   // If page is not provided or not a valid number, set it to a default value of 1
//   if (!page || isNaN(page)) {
//     page = 1;
//   }

//   let skip = (page - 1) * limit;
//   let totalPage;

//   try {
//     // Retrieve the paginated data using the limit and skip values
//     const pricing = await driverModel.aggregate([
//       {
//         $lookup: {
//           from: 'countries',
//           foreignField: '_id',
//           localField: 'country_id',
//           as: 'countrydata'
//         }
//       },
//       {
//         $unwind: '$countrydata'
//       },
//       {
//         $lookup: {
//           from: 'cities',
//           foreignField: '_id',
//           localField: 'city_id',
//           as: 'citydata'
//         }
//       },
//       {
//         $unwind: '$citydata'
//       },
//       { $skip: (skip) },{$limit:(limit)}
//     ]);

//     // Retrieve the total count of documents in the collection
//     const count = await driverModel.countDocuments();

//     // Calculate the total number of pages based on the count and limit
//     totalPage = Math.ceil(count / limit);

//     if (!pricing) {
//       return res.send("No driver  found.");
//     }

//     res.send({ pricing, count, totalPage });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

router.get("/driverdata", async (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let search = req.query.search;
  let sortfield = req.query.sortfield || "drivername";
  let sortorder = req.query.sortorder === "desc" ? -1 : 1;

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

  try {
    let query = {};

    // If search query is provided, add it to the query object
    if (search) {
      query = {
        $or: [
          { drivername: { $regex: search, $options: "i" } },
          { driveremail: { $regex: search, $options: "i" } },
          { driverphonenumber: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Retrieve the paginated data using the limit, skip, and query values
    let pricingQuery = driverModel.aggregate([
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
        preserveNullAndEmptyArrays: true
      }},
      { $match: query }, // Apply search query
      { $sort: { [sortfield]: sortorder } }, // Apply sorting
      { $skip: skip },
      { $limit: limit },
    ]);

    // Retrieve the total count of documents in the collection
    const count = await driverModel.countDocuments(query);

    // Calculate the total number of pages based on the count and limit
    totalPage = Math.ceil(count / limit);

    const driver = await pricingQuery.exec();

    if (!driver) {
      return res.send("No driver found.");
    }

    res.send({ driver, count, totalPage });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});




// router.post("/assigndriverdatadata", async (req, res) => {
//   try {
//     const city_id = new mongoose.Types.ObjectId(req.body.city_id);
//     const assignService = new mongoose.Types.ObjectId(req.body.assignService); //vehicle id 

//     let pricingQuery = driverModel.aggregate([
//       {
//         $match: {
//           status: true,
//           city_id: city_id,
//           assignService: assignService,
//           assign:"0"
//         },
//       },
//       {
//         $lookup: {
//           from: "countries",
//           foreignField: "_id",
//           localField: "country_id",
//           as: "countrydata",
//         },
//       },
//       {
//         $unwind: "$countrydata",
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
//           localField: "assignService",
//           as: "vehicledata",
//         },
//       },
//       {
//         $unwind: {
//           path: "$vehicledata",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
      
//     ]);

//     const driver = await pricingQuery.exec();

//     console.log(driver);

//     res.send({ driver });
//   } catch (error) {
//     res.status(500).send(error);
//     console.log(error);
//   }
// });


module.exports = router;
