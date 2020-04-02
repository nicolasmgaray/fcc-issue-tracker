/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const { Issue } = require("../models");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title"
        })
        .end(function(err, res) {
          assert.notEqual(res.status, 200);
          assert.include(res.body.error, "Issue validation failed");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    // TESTING ID
    let _id = "";

    beforeEach(done => {
      Issue.create(
        {
          project: "test",
          issue_title: "Title",
          issue_text: "Text",
          assigned_to: "Mocha & Chai",
          created_by: "Test"
        },
        (err, result) => {
          _id = result._id;
          done();
        }
      );
    });

    afterEach(done => {
      Issue.deleteMany({ project: "test" }, () => {
        done();
      });
    });

    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send()
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.include(res.body.error, "ID required");
          done();
        });
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: _id,
          issue_title: "Updated Title"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.include(res.body.issue_title, "Updated Title");
          done();
        });
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: _id,
          open: "false",
          issue_title: "Updated Title",
          issue_text: "Updated Text",
          assigned_to: "Update Assignment",
          status_text: "Updated Status"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Updated Title");
          assert.equal(res.body.issue_text, "Updated Text");
          assert.equal(res.body.assigned_to, "Update Assignment");
          assert.equal(res.body.status_text, "Updated Status");
          assert.equal(res.body.open, false);
          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      
      beforeEach(done => {
        Issue.create(
          [
            {            
              project: "test",
              issue_title: "Title",
              issue_text: "Text",
              assigned_to: "Mocha",
              created_by: "Test"
            },
            {      
              project: "test",
              issue_title: "Title 2",
              issue_text: "Text",
              assigned_to: "Mocha",
              created_by: "Test",
              open: false
            },
            {       
               project: "test",
              issue_title: "Title",
              issue_text: "Text",
              assigned_to: "Chai",
              created_by: "Test",
              open: false
            },
            {           
              project: "test",
              issue_title: "Title",
              issue_text: "Text",
              assigned_to: "Chai",
              created_by: "Test",
             
            }
          ],
          () => {
            done();
          }
        );
      });

      afterEach(done => {       
        Issue.deleteMany({ project: "test" }, (err) => {         
          done();
        });
      });

      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query()
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: false })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);             
            assert.lengthOf(res.body,2)
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
         chai
          .request(server)
          .get("/api/issues/test")
          .query({ assigned_to: "Mocha",open: false,  })
          .end(function(err, res) {          
            assert.equal(res.status, 200);
            assert.isArray(res.body);             
            assert.lengthOf(res.body,1)
            done();
          });
        
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    
    let _id;
    
      beforeEach(done => {
        Issue.create(
          
            {            
              project: "test",
              issue_title: "Title",
              issue_text: "Text",
              assigned_to: "Mocha",
              created_by: "Test"
            },          
          (err,doc) => {
            _id = doc._id;
            done();
          }
        );
      });

      afterEach(done => {       
        Issue.deleteMany({ project: "test" }, (err) => {         
          done();
        });
      });
    
    test("No _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send()
          .end(function(err, res) { 
            assert.equal(res.status, 400);    
            assert.equal(res.body.error,"ID required" )
            done();
          });
      
    });

    test("Valid _id", function(done) {
       chai
          .request(server)
          .delete("/api/issues/test")
          .send({_id:_id})
          .end(function(err, res) { 
            assert.equal(res.status, 200);    
            assert.equal(res.body._id, _id);
            done();
          });
    });
  });
});
