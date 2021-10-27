const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//uri and client

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ip6hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//async function

async function run() {
  try {
    await client.connect();
    // console.log("connected to database! ");
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //*GET API or GET all data
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //*GET API for single services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //*POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      //check for data enter correctly
      console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      //   res.send("post hitted");
      res.json(result);
    });

    //*DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //বার বার যেহেতু আমরা কল করব তাই এইটাকে ক্লোজ করব না এইটা না লিখলেও চলবে
    // await client.close();
  }
}

//call the function
run().catch(console.dir);

//*app get default route
app.get("/", (req, res) => {
  res.send("Running genius server");
});
//get hello
app.get("/hello", (req, res) => {
  res.send("hello world updated");
});
//*app listen port
app.listen(port, () => [console.log("Running genius server on port: ", port)]);

/*
 *steps
 *One time
 *1. Open heroku account
 *2. Heroku software Install
 *Every Project
 *1. git init
 *2. .gitignore (node_modules , .env)
 *3. push everything to git
 *4. make sure you have this script : "start": "start index.js"
 *5. make sure put: process.env.PORT in front of your port number
 *terminal
 *6. heroku login
 *7. heroku create (only one time for a project)
 *8. command: git push heroku main
 *---------
 *update
 *1. save everything check locally
 *2. git add . , git commit -m , git push
 *3.  git push heroku main
 */
