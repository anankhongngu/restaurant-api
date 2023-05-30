const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String,
    price: String,
    promotion: String,
    image_combo: String,
    code: String
}, {
    timestamps: true,
});

const Menu = mongoose.model("menu", menuSchema);

module.exports = Menu;