const Table = require('../models/table');

const postTable = async(req, res) => {
    const { code, seats } = req.body;
    try {
        const foundedTable = await Table.findOne({ code });
        if (foundedTable) {
            return res.status(404).send({ message: 'Table already existed!' });
        }
        const newTable = new Table({ code, seats });
        const result = await newTable.save();
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const getTable = async(req, res) => {
    try {
        const foundedTable = await Table.find();
        if (!foundedTable) {
            return res.status(404).send({ message: 'Table not found' });
        }
        res.status(200).send(foundedTable);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const deleteTable = async(req, res) => {
    const { id } = req.query;
    try {
        const result = await Table.findByIdAndDelete(id);
        res.send(result);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const updateTable = async(req, res) => {
    const { code, seats } = req.body;
    try {
        const foundeTable = await Menu.findOne({ code });
        if (!foundeTable) {
            return res.status(404).send({ message: 'Table not found' });
        }
        await Table.updateOne({ code, seats });
        res.status(200).send({ message: 'Update successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

module.exports = {
    postTable,
    getTable,
    deleteTable,
    updateTable
}