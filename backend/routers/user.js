const express = require("express");
const router = express();
const multer = require("multer");
const userModel = require("../models/user");
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
    destination: "public/userprofile",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
});

router.post("/user", upload.single("image"), async (req, res) => {
    try {
        let userdata;
     
            userdata =  new userModel({
                username: req.body.username,
                useremail: req.body.useremail,
                userphonenumber: req.body.userphonenumber,
                usercountrycode: req.body.usercountrycode,
                image: req.file.originalname,
            })

       await userdata.save();
        console.log(userdata);
        res.send({
            success: true,
            userdata,
            message: "add user successfully ",
        });
    } catch (error) {
        console.log(error);
        if (error.keyPattern) {
            if (error.keyPattern.useremail) {
                return res.status(500).send({
                    success: false,
                    message: "email already exist!!!!! "
                })
            } else {
                return res.status(500).send({
                    success: false,
                    message: "phone number already exist!!!!!"
                })
            }
        }

        res.status(500).send(error)
    }
});

// get the data 
router.get("/user", async (req, res) => {
    try {
      const userdata = await userModel.find();
      res.send(userdata);
    } catch (error) {
      res.send(error);
    }  
})

// update user 



router.patch('/user/:id', upload.single("image") , async(req,res)=>{
  console.log(req.body);
  console.log(req.file);

  const _id = req.params.id;


  try{
    const updateUser = await userModel.findByIdAndUpdate(_id, req.body ,{new: true}); 

  if (req.file) {
    updateUser.image= req.file.originalname
  }
  await updateUser.save();
    // console.log(updateUser);
    res.send({updateUser, success:true , message:"update user successfully !!!"}); 
  }
  catch(error){ 
    console.log(error);
    if (error.keyPattern) {
              if (error.keyPattern.useremail) {
                  return res.status(500).send({
                      success: false,
                      message: "email already exist!!!!! "
                  })
              } else {
                  return res.status(500).send({
                      success: false,
                      message: "phone number already exist!!!!!"
                  })
              }
    }

    return res.status(500).send({success: false , message: " please add vehicle "})
  }
});
// router.patch('/user/:id', upload.single("image") , async(req,res)=>{
//     const _id = req.params.id;
//     try{
//       const updateUser = await userModel.findByIdAndUpdate(_id, {
//         username: req.body.username,
//         useremail: req.body.useremail,
//         userphonenumber: req.body.userphonenumber,
//         usercountrycode: req.body.usercountrycode,
//     },{new: true}); 
  
//     if (req.file) {
//       updateUser.image= req.file.originalname
//     }
//     await updateUser.save();
//       // console.log(updateUser);
//       res.send({updateUser , message : " Update User Successful"}); 
//     }
//     catch(error){ 
//       console.log(error);
//       if (error.keyPattern) {
//         if (error.keyPattern.useremail) {
//             return res.status(500).send({
//                 success: false,
//                 message: "email already exist!!!!! "
//             })
//         } else {
//             return res.status(500).send({
//                 success: false,
//                 message: "phone number already exist!!!!!"
//             })
//         }
//     }
  
//       return res.status(500).send({success: false , error , message: " please add user "})
//     }
//   });

//   delete user 
router.delete("/user/:id", async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteuser = await userModel.findByIdAndDelete(_id, req.body);
  
      if (!req.params.id) {
        return res.status(404).send();
      } else {
        res.send({success:true,deleteuser, message:"delete user succesful"});
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

// pagination 
// router.get("/user/userdata", async (req, res) => {
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
    
//     const pricing = await userModel.find().skip(skip).limit(limit)
  
//     // Retrieve the total count of documents in the collection
//     const count = await userModel.countDocuments();

//     // Calculate the total number of pages based on the count and limit
//     totalPage = Math.ceil(count / limit);

//     if (!pricing) {
//       return res.send("No pricing found.");
//     }

//     res.send({ pricing, count, totalPage });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

//  search 

// router.get('/usersearch', async (req, res) => {
//   const searchTerm = req.query.q;

//   if (!searchTerm) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     // Perform the search query using MongoDB's $regex operator
//     const results = await userModel.find({
//       username: { $regex: searchTerm, $options: 'i' },
//     });

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// }); 
router.get('/usersearch', async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    // Perform the search query using MongoDB's $regex operator
    const results = await userModel.find({
      username: { $regex: searchTerm, $options: 'i' },
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.get("/user/userdata", async (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let search = req.query.search;
  let sortfield = req.query.sortfield || 'username'; 
  let sortorder = req.query.sortorder === "desc" ? -1 : 1;
  if (!limit || isNaN(limit)) {
    limit = 5;
  }
  if (!page || isNaN(page)) {
    page = 1;
  }

  let skip = (page - 1) * limit;
  let totalPage;

  try {
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { useremail: { $regex: search, $options: "i" } },
          { userphonenumber: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Retrieve the paginated data using the limit, skip, and query values
    let pricingQuery = userModel.find(query);

    // If sortField is provided, add sorting to the query
    if (sortfield) {
      pricingQuery = pricingQuery.sort({ [sortfield]: sortorder });
    }

    // Calculate the total count of documents in the collection
    const count = await userModel.countDocuments(query);

    // Calculate the total number of pages based on the count and limit
    totalPage = Math.ceil(count / limit);

    // If page is greater than totalPage, set it to the last page
    if (page > totalPage) {
      page = totalPage;
      skip = (page - 1) * limit;
    }

    // Retrieve the paginated data using the updated skip value
    pricingQuery = pricingQuery.skip(skip).limit(limit);

    const pricing = await pricingQuery.exec();

    if (!pricing) {
      return res.send("No pricing found.");
    }

    res.send({ pricing, count, totalPage });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;