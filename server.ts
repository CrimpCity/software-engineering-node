/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
  *     <li>dislikes</li>
 * </ul>
 * 
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import express, { Request, Response } from 'express';
import CourseController from "./controllers/CourseController";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import LikeController from "./controllers/LikeController";
import DislikeController from './controllers/DislikeController';
import AuthenticationController from './controllers/AuthenticationController';
import mongoose from "mongoose";
var cors = require('cors')


const session = require("express-session");
const app = express();
let sess = {
    // put this into an env file
    secret: "secretKey",
    proxy: true,
    cookie: {
        // this must be set to false when running the client and server locally.
        // when we deploy, change this to true
        secure: false,
        sameSite: 'none'
        // provide resave option (per warning)
    }
}

if (process.env.ENV === 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true;
}

app.use(session(sess));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));

app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})


// build the connection string
const PROTOCOL = "mongodb+srv";
const DB_USERNAME = "Georgian";
const DB_PASSWORD = "Georgian";
const HOST = "cluster0.a0awg.mongodb.net";
const DB_NAME = "myFirstDatabase";
const DB_QUERY = "retryWrites=true&w=majority";
const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`;
// connect to the database
mongoose.connect(connectionString);


// create RESTful Web service API
const courseController = new CourseController(app);
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likesController = LikeController.getInstance(app);
const dislikesController = DislikeController.getInstance(app);
AuthenticationController(app);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
