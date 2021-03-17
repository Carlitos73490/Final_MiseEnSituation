const express = require("express")
const app = express()

//-----------------------------------------CONNEXION BD
let mongoDb = require("mongodb");
let MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;
client.connect(err => {
    db = client.db("MiseEnSituation")
    console.log("connected")
})

//-----------------------------------------------------------ROUTES STATIQUES

app.use("/public/css", express.static(__dirname + "/public/css"))
app.use("/public/css", express.static(__dirname + "/node_modules/bootstrap/dist/css/"))

app.use("/public/js", express.static(__dirname + "/public/js"))
app.use("/public/js", express.static(__dirname + "/node_modules/vue/dist/"))
app.use("/public/js", express.static(__dirname + "/node_modules/vue-resource/dist/"))


//-------------------------------------------------------ROUTE UNIQUE DE FRONT

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html")
})

//--------------------------------------------------------ROUTE SERVICE (REST)


app.get("/beer/list", (req, res) => {
    console.log("beer/list")
    db.collection("beers").find({ }).toArray((err, docs) => {
        console.log(err)
        res.json(docs)
    })
    //res.json(beers)
})



app.get("/portal/add", (req, res) => {
    console.log("beer/add")
    let beer = req.query
    db.collection("beers").insertOne(beer, (err, docs) => {
        res.json(docs.ops)
    })
})

//http://localhost:1338/beer/update?id=603e18452c47bf13e40baa96&name=testdur&country=Chine

app.get("/portal/update", (req, res) => {
    console.log("beer/update")
    let data = req.query
    let id = req.query.id
    let allUpdated = []
    for (let key in data){
        if(key != id) {
            //allUpdated.push(new Promise((resolve,reject) =>{
            let value = data[key]
            let o = new Object()
            o[key] = value //Name
            //o.key = value //Key
            console.log(id, key, value)
            allUpdated.push(db.collection("beers").updateOne(
                {_id: new mongoDb.ObjectId(id)},
                {$set: o},
                (err, docs) => {
                    console.log(err);
                    //console.log("resolve");
                    //resolve();
                }))
            //}))
        }
    }
    Promise.all(allUpdated).then(() =>[
        res.json({ok : true})
    ])
})







app.listen(1338)