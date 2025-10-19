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

        app.get("/active-posts/featured", async (req, res) => {
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
                        {
                            $sample: { size: 6 },
                        },
                    ])
                    .toArray();
                console.log("Featured posts (random 6):", result);

                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get("/post/:id", async (req, res) => {
            try {
                const { id } = req.params;
                console.log("Looking for post with ID:", id);
                const result = await postCollection.findOne({
                    _id: new ObjectId(id),
                });
                console.log("Found post:", result);
                res.status(200).send(result);
            } catch (error) {
                console.error("Error fetching post:", error);
                res.status(500).send(error.message);
            }
        });

        app.get("/posts/:email", async (req, res) => {
            try {
                const { email } = req.params;
                console.log("Looking for posts by email:", email);
                const result = await postCollection
                    .find({ creatorEmail: email })
                    .toArray();
                console.log("Found posts:", result);
                res.status(200).send(result);
            } catch (error) {
                console.error("Error fetching posts by email:", error);
                res.status(500).send(error.message);
            }
        });

        app.put("/post/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const update = req.body || {};

                // Normalize deadline to ISO string if provided as Date
                if (update.deadline instanceof Date) {
                    update.deadline = update.deadline.toISOString();
                }

                const result = await postCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: update }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send("Post not found");
                }
                const updated = await postCollection.findOne({
                    _id: new ObjectId(id),
                });
                res.status(200).send(updated);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.post("/posts/new", async (req, res) => {
            try {
                const newPost = {
                    ...req.body,
                    interestedVolunteers: req.body.interestedVolunteers || 0,
                };
                const result = await postCollection.insertOne(newPost);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.delete("/posts/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const result = await postCollection.deleteOne({
                    _id: new ObjectId(id),
                });
                if (result.deletedCount === 0) {
                    return res.status(404).send("Post not found");
                }
                res.status(200).send({
                    message: "Post deleted successfully",
                });
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
