const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tyqf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//all api
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("hisab-nikash").collection("products");
    const userCollection = client.db("hisab-nikash").collection("users");

    // all products get api
    app.get("/products", async (req, res) => {
      const query = {};
      const products = productsCollection.find(query);
      const allProduct = await products.toArray();
      res.send(allProduct);
    });

    // create new user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const user = await userCollection.findOne({ email: newUser.email });
      if (!user) {
        const addUser = await userCollection.insertOne(newUser);
        res.send({ status: "Successfully create user", user: addUser });
      } else {
        res.send({ status: "Already have this user" });
      }
    });

    // add new product
    // app.post("/products", async (req, res) => {
    //   const newProducts = req.body;
    //   const product = await productsCollection.findOne({
    //     recipeName: newRecipe.recipeName,
    //   });
    //   if (!recipe) {
    //     const addRecipe = await productsCollection.insertOne(newRecipe);
    //     if (addRecipe.insertedId) {
    //       const user = await userCollection.findOne({
    //         email: newRecipe.creatorEmail,
    //       });
    //       await userCollection.updateOne(
    //         { email: newRecipe.creatorEmail },
    //         {
    //           $set: { coin: Number(user.coin) + 1 },
    //         }
    //       );
    //     }
    //     res.send({ status: "Successfully Added Product", product: addRecipe });
    //   } else {
    //     res.send({ status: "Already have Recipe" });
    //   }
    // });

    //get user by email
    app.get("/user", async (req, res) => {
      const userEmail = req.query.email;
      const user = await userCollection.findOne({ email: userEmail });
      res.send({ status: "success", user: user });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hisab-nikash");
});

app.listen(port, () => {
  console.log("Hisab Nikash Connected", port);
});
