var pomParser = require("../lib");
var expect = require('chai').expect;
var assert = require('assert');

var POM_PATH = __dirname + "/fixture/pom.xml";

describe('require("pom-parser")', function () {

  describe('loading from files', function() {
    var pomResponse = null;
    var pom = null;
    var xml = null;

    // Setup the tests using mocha's promise.
    // https://lostechies.com/derickbailey/2012/08/17/asynchronous-unit-tests-with-mocha-promises-and-winjs/
    before(function(done) {
      pomParser.parse({filePath: POM_PATH}, function(err, response) {
        expect(err).to.be.null;
        expect(response).to.be.an("object");
        
        pomResponse = response;
        pom = pomResponse.pomObject;
        xml = pomResponse.pomXml;
        done();
      });
    });

    // Tear down the tests by printing the loaded xml and the parsed object.
    after(function(done) {
      console.log("\n\nThe XML loaded");
      console.log(xml);
      console.log("\n\nThe parsed XML");
      console.log(JSON.stringify(pom, null, 2));
      done();
    });
 
    it('can load any pom.xml properly', function(done) {
      expect(pomResponse.pomXml).to.be.an("string");
      expect(pomResponse.pomObject).to.be.an("object");
      done();
    });

    it('parses xml attributes as properties', function(done) {
      expect(pom.project.xmlns).to.equal("http://maven.apache.org/POM/4.0.0");
      expect(pom.project["xmlns:xsi"]).to.equal("http://www.w3.org/2001/XMLSchema-instance"); 
      done();
    });

    it('parses xml elements as properties', function(done) {
      expect(pom.project.parent).to.be.an("object");
      expect(pom.project.parent.artifactid).to.equal("tynamo-parent");
      done();
    });

  });

  describe('when opts is null', function(){
    it('parser should throw an error', function() {
      assert.throws(function(){
        pomParser.parse(null, function(err, response){}, Error);
      });
    });
  });

  describe('when opts is empty', function(){
    it('parser should throw an error', function(){
      assert.throws(function(){ 
        pomParser.parse({}, function(err, response){}, Error);
      });
    });
  });

  describe('error scenarios', function() {
    it('should return error if file does not exist', function(done) {
      pomParser.parse({ filePath: __dirname + 'incorrect-file-path' }, function(err, response) {
        expect(response).to.be.null;
        expect(err).to.not.be.null;
        done();
      });
    });

    it('should return error if invalid xml file', function(done) {
      pomParser.parse({ filePath: __dirname + '/fixture/pom2.xml' }, function(err, response) {
        expect(response).to.be.null;
        expect(err).to.not.be.null;
        done();
      });
    });

    it('should return error if invalid xml content', function(done) {
      const invalidXml = '<parent>this is invalid</PARENT>';
      pomParser.parse({ xmlContent: invalidXml }, function(err) {
        expect(err).to.not.be.null;
        done();
      });
    });
  });
});
