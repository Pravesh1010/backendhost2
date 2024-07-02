const mongo = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.usersingnup = async (req, res) => {
  try {
    const existuser = await mongo.selectedDb
      .collection("users")
      .findOne({ email: req.body.email });
    if (existuser) {
      return res.status(500).send({ msg: "You are already a registered User" });
    }
    const insertedresponce = await mongo.selectedDb
      .collection("users")
      .insertOne({ ...req.body, email_verified: false });
    console.log(insertedresponce);
    res.send(insertedresponce);

    let token = jwt.sign({ email: req.body.email }, process.env.JCODE);
    console.log("token");
    console.log(token);

    let sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "praveshmsp@gmail.com",
        pass: `${process.env.PASS}`,
      },
      debug: false,
      logger: true,
    });

    console.log("sender")
    console.log(sender)
    let composeEmail = {
      from: "praveshmsp@gmail.com",
      // to: `${req.body.email}`,
      to: `praveshmsp@gmail.com`,
      subject: "You are registered with us successfully",
      text: `http://localhost:3001=${token}`,
    };
    sender.sendMail(composeEmail, (err) => {
      if (err) {
        console.log("Error found", err);
        return res.status(500).send({ msg: "Failed to send email" });
      } else {
        console.log("Mail sent");
        res.send({ insertedresponce, msg: "Email has been sent to your email id" });
      }
    });

    // res.json({ messege: "Email have been sent to your mail id" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await mongo.selectedDb.collection("users").find({}).toArray();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};