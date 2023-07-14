const express = require("express");
const router = express.Router();
const multer = require("multer");
const vehicle = require("../models/vehicle");
const bodyparser = require("body-parser");
router.use(bodyparser.json());

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

// Configure multer with the desired storage and file filter
const storage = multer.diskStorage({
  destination: "public/vehicleupload",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  // limits: 2 * 1000 *1000
  limits:   {fileSize: 2 * 1000 *1000}

});

router.post("/vehicletype", upload.single("image"), async (req, res) => {
  console.log(req.body);
  try {
    // let vehicletypedata;
    // if (!req.file) {
    //   return res.send({
    //     success: false,
    //     message: "Please Fill All Details!!"
    //   })
    // } else {
      vehicletypedata = new vehicle({
        vehiclename: req.body.vehiclename,
        image: req.file.originalname,
      });
     
    // }
   const vehicledata =  await vehicletypedata.save();
    console.log(vehicledata);
    res.send({
      success: true,
      vehicledata,
      message: " Hureee finallyyy add vehicle successfully ",
    });
  } catch (error) {
    
    if(error.keyPattern){
      if (error.keyPattern.vehiclename) {
        return res.status(404).send({
          success: false,
          message: "Vehicle already exist!!!!!!!!!!!!!!!!!!!!" 
        })
      } 
    }
  
    res.status(500).send({error , message : " add vehicle "})
  }
});


// get data from database 

router.get("/vehicletype", async (req, res) => {
  try {
    const vehicletypedata = await vehicle.find();
    res.send(vehicletypedata);
  } catch (error) {
    res.send(error);
  }      
})

//  Update vehicle data 

router.patch('/vehicletype/:id', upload.single("image") , async(req,res)=>{
  console.log(req.body);
  console.log(req.file);

  const _id = req.params.id;


  try{
    const updateUser = await vehicle.findByIdAndUpdate(_id, {
      vehiclename: req.body.vehiclename 
  },{new: true}); 

  if (req.file) {
    updateUser.image= req.file.originalname
  }
  await updateUser.save();
    // console.log(updateUser);
    res.send(updateUser); 
  }
  catch(error){ 
    console.log(error);
    if(error.keyPattern){
      if (error.keyPattern.vehiclename) {
        return res.status(500).send({
          success: false,
          message: "Vehicle already exist!!!!!!!!!!!!!!!!!!!!"
        })
      } 
    }

    return res.status(500).send({success: false , message: " please add vehicle "})
  }
});
module.exports = router;
// catch(error){ 
//   console.log(error);
//   if (error.code === 11000) {
//     return res.status(500).send({
//       success: false,
//       message: "The combination of city and vehicle already exists."
//     })
//   }else{}
//   return res.status(500).send({success: false , error })
// }





























