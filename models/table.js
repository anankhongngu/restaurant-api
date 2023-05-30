const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    code: String,
    seats: Number,
}, {
    timestamps: true
});

const Table = mongoose.model("table", tableSchema);

module.exports = Table;