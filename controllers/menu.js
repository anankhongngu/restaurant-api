const Menu = require('../models/menu');

const postMenu = async(req, res) => {
    const { name, price, promotion, code } = req.body;
    try {
        const foundedMenu = await Menu.findOne({ code });
        if (foundedMenu) {
            return res.status(404)
                .send({ message: "Menu already existed!" });
        }
        const newMenu = new Menu({
            name,
            price,
            promotion,
            code,
        });
        const result = await newMenu.save();
        console.log(result);
        res.send(result);
    } catch (err) {
        res.status(500)
            .send({ message: err.message });
    }
};
const getMenu = async(req, res) => {
    try {
        const foundedMenu = await Menu.find();
        if (!foundedMenu) {
            return res.status(404)
                .send({ message: "Not found menu" });
        }

        res.status(200).send(foundedMenu);
    } catch (err) {
        return res.status(500)
            .send({ message: err.message });
    }
}
const deleteMenu = async(req, res) => {
    const { id } = req.query;
    try {
        const result = await Menu.findByIdAndDelete(id);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const updateMenu = async(req, res) => {
    const { name, price, promotion, code } = req.body;
    try {
        const foundedMenu = await Menu.findOne({ code });
        if (!foundedMenu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        await Menu.updateOne({ name, price, promotion, code });
        res.status(200).send({ message: 'Update successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}


module.exports = {
    postMenu,
    getMenu,
    deleteMenu,
    updateMenu
}