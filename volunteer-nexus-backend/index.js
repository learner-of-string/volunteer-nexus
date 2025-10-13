import cors from "cors";
import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

// initiate express app
const app = express();
const port = process.env.port || 3000;

// middleware
app.use(cors(["http://localhost:5173"]));
app.use(express.json());

const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );

        const database = client.db("volunteerNexus");
        const postCollection = database.collection("volunteerNeedPosts");

        app.get("/all-posts", async (req, res) => {
            try {
                const result = await postCollection.find().toArray();
                console.log(result);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get("/active-posts", async (req, res) => {
            try {
                const result = await postCollection
                    .aggregate([
                        {
                            $addFields: {
                                deadlineDate: { $toDate: "$deadline" },
                            },
                        },
                        {
                            $match: {
                                deadlineDate: { $gte: new Date() },
                            },
                        },
                    ])
                    .toArray();
                console.log(result);

                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get("/post/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const result = await postCollection.findOne({
                    _id: new ObjectId(id),
                });
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
    res.send(`Volunteers are volunteering at ${port}`);
});

app.listen(port, () => console.log(`Volunteers are volunteering at ${port}`));
