const path = require("path");
const router = require("express").Router();
const axios = require("axios");
const db = require("../models");

const foodFunction = {
    getRecipes: function (req, res) {
        //this route makes a call to the api based on a user's grocery list.
        const ingredients = req.query.food;
       
        console.log(ingredients);
        console.log("is this working?? " + process.env.EDAMAM_ID)


        axios.get("https://api.edamam.com/search?q=" + ingredients + "&app_id=" + process.env.EDAMAM_ID + "&app_key=" + process.env.EDAMAM_KEY)
            .then(function (response) {
                // console.log(response.data.hits);
                res.json(response.data.hits);
            }).catch(function (err) {
                console.log(err);
            })
    },


    create: function (req, res) {
        //this route saves the groceries
        console.log("the create route is being hit");
        console.log(JSON.stringify(req.body));
        db.grocerylist
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err));

    },

    read: function (req, res) {
      //this route sends database grocery items to front end
      console.log("the read route has been hit");
        db.grocerylist
            .find(req.query)
            .then(dbModel => res.json (dbModel))
            .catch(err => res.status(422).json(err))
    },

    update: function (req, res){
        console.log("the update route has been hit");
        db.grocerylist
        .findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },

    use: function(req, res){
        console.log("the use route has been hit");
        db.grocerylist
        .findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },

    delete: function (req, res) {
        //this route deletes groceries from the database.
        console.log("hello");
        console.log(req.params.id);
       db.grocerylist
            .findById({ _id: req.params.id})
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
}

router.get("/api/recipes", foodFunction.getRecipes)
router.post("/api/groceries", foodFunction.create)
router.get("/api/groceries", foodFunction.read)
router.delete("/api/groceries:id", foodFunction.delete)
router.patch("/api/groceries:id", foodFunction.update)
router.patch("/api/useGroceries:id", foodFunction.use)


// If no API routes are hit, send the React app
router.use(function (req, res) {
    console.log("something is off");
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;