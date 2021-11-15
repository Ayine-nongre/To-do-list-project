const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB')
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const item = mongoose.model('item', {name: String});




app.get("/", function(req, res){

    let today = new Date();

    let options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    let day = today.toLocaleDateString("en-US",options);

    var foundItem = [];
    var itemId = []

    item.find({}, function(err, foundItems){
        if(err){
            console.log("error");
        }
        else{
            foundItems.forEach(function(foundItems) {
                var Obj = foundItems.name;
                foundItem.push(Obj);

                var id = foundItems.id;
                itemId.push(id);
            });
            
            res.render("index", {kindOfDay: day, newItem: foundItem, itemsId: itemId});
        }
    })


})

app.post("/", function(req, res){

    var itemName = req.body.items;

    let today = new Date();

    let options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    let day = today.toLocaleDateString("en-US",options);

    const object = new item({
        name: itemName
    });
    object.save();

    res.redirect("/");
    
})

app.post("/delete", function(req, res){
    var deleteId = req.body.checkbox;
    item.findByIdAndRemove(deleteId, function(err){
        if(err){
            console.log("error");;
        }
    })

    res.redirect("/");
})

app.listen(process.env.PORT || 5000, function(){
    console.log("Server is succesfully running");
})