const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const path = require("path");


require("./db/connect");


const menuRouter = require("./routers/menu");
const tableRouter = require("./routers/table");
const userRouter = require("./routers/auth");
const bookRouter = require("./routers/book");
// const uploadRouter = require("./routers/upload");
const uploadAvatarRouter = require("./controllers/upload");
const app = express();


/**
 * TODO
 *  .CRUD Menu
 *  .CRUD Table
 *  .CRUD Trip
 *  .signup, signin, jwt, track tokens , authorization, logout ,log out all
 *  .Booking Ticket
 *  .Refactor - mvc, router,
 *  .Giới thiệu buffer - stream
 *  .Upload file - filter type,limit size, serve static file
 *  .Send email
 *  .Chat module
 *  facebook login
 *  cors
 *  git
 *  deploy
 */

//closure
console.log();

const imagesFolderPath = path.join(__dirname, "images");

app.use(cors({
    origin: "http://localhost:5500",
    optionsSuccessStatus: 200,
}));

app.use(bodyParser.json());
app.use('/images', express.static(imagesFolderPath));


app.use(bookRouter);
app.use(menuRouter);
app.use(tableRouter);
app.use(userRouter);
app.use(uploadAvatarRouter);

const port = process.env.PORT || config.get("port");

app.listen(port, () => {
    console.log("listening.....");
});
//mongodb+srv://anan:Mongnghi27@cluster0.3jftq.mongodb.net/restaurant?retryWrites=true&w=majority
//api key grid mail: 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