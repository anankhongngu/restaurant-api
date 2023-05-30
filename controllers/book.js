const mongoose = require("mongoose");
const Book = require("../models/book");
const Ticket = require("../models/ticket");
const Menu = require("../models/menu");
const Table = require("../models/table");
const { Seat } = require("../models/seat");

//send mail 
const sgMail = require("@sendgrid/mail");
const config = require("config");
const sgAPIKey = config.get("sgAPIKey");
sgMail.setApiKey(sgAPIKey);

//format  
const { currencyFormat } = require("../helpers/formatNumber");
// transaction: tạo ra một chuỗi action, mà 1 trong số đó thất bại,
// từ rollback ;lại trạng thái ban đầu



//create book
const postBook = async(req, res) => {
    let {
        combo,
        dataSet,
        tableId,
    } = req.body;

    //dinh dang ngay gio
    dataSet = dataSet + " 00:00:00";

    try {
        //check menu
        const foundedMenu = await Menu.find().or([
            { _id: combo }
        ]);
        if (foundedMenu == 0) {
            return res.status(400)
                .send({ message: "Invalid Menu" });
        }

        //check table
        const foundedTable = await Table.findById(tableId);
        if (!foundedTable) {
            return res.status(400)
                .send({ message: "Invalid Table" });
        }

        //crate seat
        const seatArr = [];
        for (i = 0; i < foundedTable.seats; i++) {
            const newSeat = new Seat({
                name: i + 1,
                status: 'avaiable',
            });
            seatArr.push(newSeat);
        }

        //create book
        const newBook = new Book({
            combo,
            dataSet: dataSet,
            seats: seatArr,
            table: tableId,
            price: foundedMenu[0].price,
        });

        const result = await newBook.save();
        res.send(result);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const getBook = async(req, res) => {
    let { combo, date } = req.query;
    date = date + " 00:00:00";

    try {
        const foundedBook = await Book.find({
            combo: combo,
            dataSet: date,
        }).populate("date", "combo price");

        console.log(foundedBook);
        res.send(foundedBook);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

const getAllBook = async(req, res) => {
    const books = await Book.find();
    res.send(books);
}

// book table 
const postBookTable = async(req, res) => {
    //input
    const { bookId, seatId } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        //kiem tra
        const foundedBook = await Book.findById(bookId).session(session);
        if (!foundedBook) {
            return res.status(404)
                .send({ message: "invalid trip. Id is not exist!" });
        }

        //
        const foundedIndex = foundedBook.seats.findIndex(
            (item) => {
                return item._id.toString() === seatId && item.status === 'avaiable'
            }
        )
        if (foundedIndex === -1) {
            return res.status(404)
                .send({ message: "Invalid or the table has been booked" });
        }

        // update trạng thái ghế
        foundedBook.seats[foundedIndex].user = req.user._id;
        foundedBook.seats[foundedIndex].status = "booked";
        await foundedBook.save();
        console.log("Save BookTable");

        //tim ten combo
        const comboId = foundedBook.combo;
        const foundedCombo = await Menu.findById(comboId).session(session);
        console.log(foundedCombo);




        //tao ticket
        await Ticket.create([{
            user: req.user._id,
            book: foundedBook._id,
            seats: [foundedBook.seats[foundedIndex]],
        }, ], { session: session });
        console.log("Save Ticket");


        await session.commitTransaction();
        session.endSession();

        //send mail
        sgMail.send({
                from: "dautayy27@gmail.com",
                to: req.user.email,
                subject: "Welcome to KingCup",
                html: `<h2 style='color: red'>Congratulations!!!</h2>
            <p>Congratulations on your successful book table </p>
            <p>Loại combo: ${foundedCombo.name} - Đơn giá (chưa bao gồm VAT): ${currencyFormat(foundedBook.price)}</p> 
            <p>Thời gian: ${foundedBook.dataSet}</p>
            <p>Bàn số: ${foundedCombo.code}</p>
            `,
            })
            .then((res) => {
                console.log("success");
            })
            .catch((err) => {
                console.log(err);
            });
        //

        res.send({ message: "Book table successfully" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({ message: err.message });
    }
}

module.exports = {
    postBookTable,
    postBook,
    getBook,
    getAllBook
}