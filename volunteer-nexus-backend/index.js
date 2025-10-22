import cors from "cors";
import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// initiate express app
const app = express();
const port = process.env.port || 3000;

// middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const uri = process.env.DB_URI;

const verifyToken = (req, res, next) => {
    const token = req.cookies?.jwt_token;
    if (!token) return res.status(401).send({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(401).send({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

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

        // jwt authentication apis
        app.post("/jwt", async (req, res) => {
            console.log("JWT endpoint - cookies:", req.cookies);
            console.log("JWT endpoint - headers:", req.headers);
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            console.log("Setting JWT cookie for user:", user.email);
            res.status(200)
                .cookie("jwt_token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .send({ message: "JWT token created successfully" });
        });

        app.get("/all-posts", async (req, res) => {
            try {
                const result = await postCollection.find().toArray();
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

                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get("/active-posts/featured", async (req, res) => {
            console.log("cookies", req.cookies);
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

                res.status(200).send(result);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get("/post/:id", verifyToken, async (req, res) => {
            console.log("inside post endpoint");
            try {
                const { id } = req.params;
                const result = await postCollection.findOne({
                    _id: new ObjectId(id),
                });
                res.status(200).send(result);
            } catch (error) {
                console.error("Error fetching post:", error);
                res.status(500).send(error.message);
            }
        });

        app.get("/posts/:email", verifyToken, async (req, res) => {
            if (req.user.email !== req.params.email) {
                return res.status(401).send({ message: "Unauthorized" });
            }

            try {
                const { email } = req.params;
                const result = await postCollection
                    .find({ creatorEmail: email })
                    .toArray();
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
                res.status(500).send({
                    message: "Failed to create user",
                    error: error.message,
                });
            }
        });

        app.get("/users/:email", async (req, res) => {
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
                res.status(500).send({
                    message: "Failed to submit application",
                    error: error.message,
                });
            }
        });

        app.post("/signout", async (req, res) => {
            try {
                res.clearCookie("jwt_token", {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 0,
                });
                res.status(200).send({
                    message: "Signed out successfully",
                });
            } catch (error) {
                res.status(500).send({
                    message: "Failed to sign out",
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
