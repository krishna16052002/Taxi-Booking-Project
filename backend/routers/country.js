const express = require("express");
const router = express();

const countrymodel = require("../models/country");
const bodyparser = require("body-parser");
router.use(bodyparser.json());

router.post("/country", async (req, res) => {
  try {
  console.log(req.body);
    const country = new countrymodel({countryname: req.body.countryname, countrycode : req.body.countrycode , countrytimezone : req.body.countrytimezone , countrycurrency: req.body.countrycurrency, flag: req.body.flag}
     );
    const countrydata =  await country.save();
    // console.log(countrydata);
    res.send({success: true,
      countrydata,
      message: "  add country successfully "});
  } 
  catch (error) {
    console.log(error);
    if(error.keyPattern){
      if (error.keyPattern.countryname) {
        return res.status(500).send({
          success: false,
          message: "country already exist!!!!!!!!!!!!!!!!!!!!" 
        })
      } 
    }else{
      res.status(500).send({error})

    }
  
  }
});

router.get("/country", async (req, res) => {
  try {
    const countrydata = await countrymodel.find();
    res.send(countrydata);
  } catch (error) {
    res.send(error);
  }      
})

// router.get('/countrydata', async (req, res) => {
//   const searchTerm = req.query.q;

//   if (!searchTerm) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     // Perform the search query using MongoDB's $regex operator
//     const results = await countrymodel.find({
//       countryname: { $regex: searchTerm, $options: 'i' },
//     });

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });
router.get('/countrydata', async (req, res) => {
  const searchTerm = req.query.q;

  try {
    let query = {};

    if (searchTerm) {
      query = { countryname: { $regex: searchTerm, $options: 'i' } };
    }

    const results = await countrymodel.find(query);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;

