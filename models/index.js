const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text:  { type: String, required: true },
  created_on:  { type: Date, default: Date.now  },
  updated_on:  { type: Date, default: Date.now },
  created_by:  { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" },
})

exports.Issue = mongoose.model('Issue', issueSchema);

/* 
[{"_id":"5871dda29faedc3491ff93bb",
"issue_title":"Fix error in posting data",
"issue_text":"When we post data it has an error.",
"created_on":"2017-01-08T06:35:14.240Z",
"updated_on":"2017-01-08T06:35:14.240Z",
"created_by":"Joe",
"assigned_to":"Joe", optional 
"open":true,  
"status_text":"In QA optional 
*/

  
