const express = require("express")
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//-----------------------------------------CONNEXION BD
let mongoDb = require("mongodb");
let MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;
client.connect(err => {
    db = client.db("situation")
    console.log("connected")
})

//-----------------------------------------------------------ROUTES STATIQUES

app.use("/public/css", express.static(__dirname + "/public/css"))
app.use("/public/css", express.static(__dirname + "/node_modules/bootstrap/dist/css/"))

app.use("/public/js", express.static(__dirname + "/public/js"))
app.use("/public/js", express.static(__dirname + "/node_modules/vue/dist/"))
app.use("/public/js", express.static(__dirname + "/node_modules/vue-resource/dist/"))
app.use("/public/js", express.static(__dirname + "/node_modules/axios/dist/"))


//-------------------------------------------------------ROUTE UNIQUE DE FRONT

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html")
})

//--------------------------------------------------------ROUTE SERVICE (REST)

app.get("/portals/list", (req, res) => {
    console.log("list")
    db.collection("portals").find({ }).toArray((err, docs) => {
        console.log(err)
        res.json(docs)
    })
    //res.json(beers)
})


app.post("/portals/add", (req, res) => {
    //console.log('Got body:', req.body);
    let portal = req.body
    // console.log("Add")
    // console.log(portal);

     db.collection("portals").insertOne(portal, (err, docs) => {
        res.json(docs.ops)
     })
})



app.listen(1338)