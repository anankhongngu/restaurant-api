const currencyFormat = (number, opt = {}) => {
    const formater = new Intl.NumberFormat("en-US", opt);
    return formater.format(number);
};

module.exports = { currencyFormat };