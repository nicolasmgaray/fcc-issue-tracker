"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");
const { Issue } = require("../models");
const Schema = mongoose.Schema;

module.exports = async app => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true
    });

    console.log("Connected to BD");

    app
      .route("/api/issues/:project")
      .get(async (req, res) => {
        var project = req.params.project;       
        let result = await Issue.find({ project, ...req.query }).exec();
        res.json(result);
      })

      .post(async (req, res) => {
        let data = req.body;
        let project = req.params.project;
        let issue = { project, ...data };
        let result = await Issue.create(issue);
        res.json(result);
      })

      .put(async (req, res) => {
        const { _id, ...data } = req.body;
        if (!_id) res.status(400).json({ error: "ID required" });
        for (let propName in data) {
          if (data[propName] == "") {
            delete data[propName];
          }
        }
        data.updated_on = Date.now();
        let result = await Issue.findByIdAndUpdate(_id, data, {
          new: true
        }).exec();
        if (!result) res.status(400).json({ error: "ID not found" });
        res.json(result);
      })

      .delete(async (req, res) => {
        const { _id, ...data } = req.body;
        if (!_id) res.status(400).json({ error: "ID required" });      
        let result = await Issue.findByIdAndDelete(_id);
        if (!result) res.status(400).json({ error: "ID not found" });
        res.json(result);
      });

    app.use(function(req, res, next) {
      res
        .status(404)
        .type("text")
        .send("Not Found");
    });

    app.use((err, req, res, next) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
