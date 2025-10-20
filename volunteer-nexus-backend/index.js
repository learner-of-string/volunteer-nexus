import cors from "cors";
import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import jwt from "jsonwebtoken";

// initiate express app
const app = express();
const port = process.env.port || 3000;

// TODO: implement jwt token verification

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
        const usersCollection = database.collection("users");
        const applicationsCollection = database.collection("applications");

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

        // User management endpoints
        app.post("/users", async (req, res) => {
            try {
                const { displayName, email, photoURL } = req.body;

                // Validate required fields
                if (!displayName || !email) {
                    return res.status(400).send({
                        message: "Display name and email are required",
                    });
                }

                // Check if user already exists
                const existingUser = await usersCollection.findOne({ email });
                if (existingUser) {
                    return res.status(200).send({
                        message: "User already exists",
                        user: existingUser,
                    });
                }

                // Create new user document
                const newUser = {
                    displayName: displayName.trim(),
                    email: email.trim(),
                    photoURL: photoURL || "",
                    appliedCampaigns: [],
                };

                const result = await usersCollection.insertOne(newUser);

                res.status(201).send({
                    message: "User created successfully",
                    user: {
                        _id: result.insertedId,
                        ...newUser,
                    },
                });
            } catch (error) {
                console.error("Error creating user:", error);
                res.status(500).send({
                    message: "Failed to create user",
                    error: error.message,
                });
            }
        });

        app.get("/users/:email", async (req, res) => {
            // This API endpoint is used to fetch a user document from the database based on their email address.
            // It responds with the user's data if found, or a 404 error if the user does not exist.
            try {
                const { email } = req.params;
                const user = await usersCollection.findOne({ email });

                if (!user) {
                    return res.status(404).send({
                        message: "User not found",
                    });
                }

                res.status(200).send(user);
            } catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).send({
                    message: "Failed to fetch user",
                    error: error.message,
                });
            }
        });

        // Application management endpoints
        // Get applications by applicant email
        app.get("/applications/applicant/:email", async (req, res) => {
            try {
                const { email } = req.params;

                const applications = await applicationsCollection
                    .find({ applicantEmail: email })
                    .sort({ applicationDate: -1 })
                    .toArray();

                const applicationsWithPostDetails = await Promise.all(
                    applications.map(async (application) => {
                        const post = await postCollection.findOne({
                            _id: application.postId,
                        });

                        return {
                            _id: application._id,
                            postId: application.postId,
                            postTitle: post?.postTitle || "Post not found",
                            category: post?.category || "Unknown",
                            applicantEmail: application.applicantEmail,
                            organizerEmail: application.creatorEmail,
                            status: application.status,
                            appliedDate: application.applicationDate,
                        };
                    })
                );

                res.status(200).send(applicationsWithPostDetails);
            } catch (error) {
                console.error("Error fetching applicant applications:", error);
                res.status(500).send({
                    message: "Failed to fetch applicant applications",
                    error: error.message,
                });
            }
        });
        app.get("/applications/:organizerEmail", async (req, res) => {
            try {
                const { organizerEmail } = req.params;

                // Get applications for this organizer
                const applications = await applicationsCollection
                    .find({ creatorEmail: organizerEmail })
                    .sort({ applicationDate: -1 }) // Sort by newest first
                    .toArray();

                // Get post details for each application
                const applicationsWithPostDetails = await Promise.all(
                    applications.map(async (application) => {
                        const post = await postCollection.findOne({
                            _id: application.postId,
                        });

                        // Get applicant details
                        const applicant = await usersCollection.findOne({
                            email: application.applicantEmail,
                        });

                        return {
                            _id: application._id,
                            postId: application.postId,
                            postTitle: post?.postTitle || "Post not found",
                            category: post?.category || "Unknown",
                            applicantName:
                                applicant?.displayName || "Unknown User",
                            applicantEmail: application.applicantEmail,
                            organizerEmail: application.creatorEmail,
                            status: application.status,
                            appliedDate: application.applicationDate,
                        };
                    })
                );

                res.status(200).send(applicationsWithPostDetails);
            } catch (error) {
                console.error("Error fetching applications:", error);
                res.status(500).send({
                    message: "Failed to fetch applications",
                    error: error.message,
                });
            }
        });

        // Update application status
        app.put("/applications/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const { status } = req.body || {};

                if (!status) {
                    return res
                        .status(400)
                        .send({ message: "Status is required" });
                }

                const result = await applicationsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({
                        message: "Application not found",
                    });
                }

                const updated = await applicationsCollection.findOne({
                    _id: new ObjectId(id),
                });

                res.status(200).send({
                    message: "Application status updated",
                    application: updated,
                });
            } catch (error) {
                console.error("Error updating application status:", error);
                res.status(500).send({
                    message: "Failed to update application status",
                    error: error.message,
                });
            }
        });

        app.post("/applications", async (req, res) => {
            try {
                const { postId, applicantEmail } = req.body;

                // Validate required fields
                if (!postId || !applicantEmail) {
                    return res.status(400).send({
                        message: "Post ID and applicant email are required",
                    });
                }

                // Check if user exists
                const user = await usersCollection.findOne({
                    email: applicantEmail,
                });
                if (!user) {
                    return res.status(404).send({
                        message: "User not found. Please sign up first.",
                    });
                }

                // Check if post exists
                const post = await postCollection.findOne({
                    _id: new ObjectId(postId),
                });
                if (!post) {
                    return res.status(404).send({
                        message: "Post not found",
                    });
                }

                // Check if user has already applied to this post
                const existingApplication =
                    await applicationsCollection.findOne({
                        postId: new ObjectId(postId),
                        applicantEmail: applicantEmail,
                    });

                if (existingApplication) {
                    return res.status(409).send({
                        message:
                            "You have already applied to this volunteer opportunity",
                    });
                }

                // Create new application document
                const newApplication = {
                    postId: new ObjectId(postId),
                    applicantEmail: applicantEmail,
                    creatorEmail: post.creatorEmail,
                    status: "pending",
                    applicationDate: new Date(),
                };

                const result = await applicationsCollection.insertOne(
                    newApplication
                );

                // Update the post's interestedVolunteers count
                await postCollection.updateOne(
                    { _id: new ObjectId(postId) },
                    { $inc: { interestedVolunteers: 1 } }
                );

                // Add the post ID to user's appliedCampaigns array
                await usersCollection.updateOne(
                    { email: applicantEmail },
                    { $addToSet: { appliedCampaigns: new ObjectId(postId) } }
                );

                res.status(201).send({
                    message: "Application submitted successfully",
                    application: {
                        _id: result.insertedId,
                        ...newApplication,
                    },
                });
            } catch (error) {
                console.error("Error creating application:", error);
                res.status(500).send({
                    message: "Failed to submit application",
                    error: error.message,
                });
            }
        });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
    res.send(`Volunteers are sleeping now at ${port}`);
});

app.listen(port, () => console.log(`Volunteers are sleeping now at ${port}`));
