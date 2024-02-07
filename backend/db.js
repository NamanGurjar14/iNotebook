// const { MongoClient } = require("mongodb")
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path: '../.env'});

const val = process.env.DB_PORT;
const name = process.env.DB_NAME;
const mongoURI =`mongodb://${val}/${name}`;
//const client = new MongoClient(mongoURI);
//console.log(val);
const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(mongoURI);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  module.exports = connectToMongo;
  