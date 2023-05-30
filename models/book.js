const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const bookSchema = new mongoose.Schema({
    combo: String,
    dataSet: Date,
    seats: [seatSchema],
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table"
    },
    price: String
}, {
    timestamps: true
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;