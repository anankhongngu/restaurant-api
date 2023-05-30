const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../helpers/auth");

const sgMail = require("@sendgrid/mail");
const config = require("config");
const sgAPIKey = config.get("sgAPIKey");
sgMail.setApiKey(sgAPIKey);

//
const User = require("../models/user");

const signupUser = async(req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        const foundedUser = await User.findOne().or([{ username }, { email }]);
        if (foundedUser) {
            return res.status(400).send({ message: "User already exists" });
        }
        const newUser = new User({
            username,
            email,
            password,
            phone,
            role: "user",
        });

        let result = await newUser.save();
        result = result.toObject();
        delete result.password;

        //send mail
        sgMail.send({
                from: "dautayy27@gmail.com",
                to: result.email,
                subject: "Welcome to vexere",
                html: `<h2 style='color: red'>Welcome!!!</h2>
                <p>Congratulations on your successful registration </p>
                `,
            })
            .then((res) => {
                console.log("success");
            })
            .catch((err) => {
                console.log(err);
            });
        //
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const signinUser = async(req, res) => {
    const { username, password } = req.body;

    //check username
    const foundedUser = await User.findOne({ username });
    if (!foundedUser) {
        return res
            .status(401)
            .send({ message: "Tài khoản hoặc mật khẩu không đúng" });
    }

    //check password
    const isMatch = await bcrypt.compare(password, foundedUser.password);
    if (!isMatch)
        return res
            .status(401)
            .send({ message: "Tài khoản hoặc mật khẩu không đúng" });

    //generate token
    const token = await jwt.sign({
            _id: foundedUser._id,
        },
        "restaurant"
    );

    // save token vào user login
    foundedUser.tokens.push(token);
    await foundedUser.save();

    //send token về cho frontebd
    //send result
    res.send(token);
};

const meUser = async(req, res) => {
    const result = req.user.toJSON();
    res.send(result);
};
const logoutUser = async(req, res) => {
    const index = req.user.tokens.findIndex((token) => token === req.token);
    req.user.tokens.splice(index, 1);

    await req.user.save();
    res.send();
};

const logoutAllUser = async(req, res) => {
    const newTokens = req.user.tokens.filter((token) => token === req.token);
    req.user.tokens = newTokens;

    await req.user.save();
    res.send();
};


module.exports = {
    signupUser,
    signinUser,
    meUser,
    logoutUser,
    logoutAllUser
}