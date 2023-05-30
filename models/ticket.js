const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    seats: [seatSchema]
}, {
    timestamps: true
});

const Ticket = mongoose.model("ticket", ticketSchema);

module.exports = Ticket;