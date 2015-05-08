/* jshint expr:true */
"use strict";

describe("Services: Company Core API Service", function() {

  beforeEach(module("risevision.core.company"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    
    $provide.service('coreAPILoader',function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          subcompanies: {
            list: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.companiesResp);
                  }, 0);
                }
              };
            }
          },
          company: {
            list: function(obj) {              
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    expect(obj).to.be.truely;
                    expect(obj.companyId).to.equal("some_id");
                    expect(obj.search).to.equal("name:~\'s\' OR id:~\'s\' OR street:~\'s\' OR unit:~\'s\' OR city:~\'s\' OR province:~\'s\' OR country:~\'s\' OR postalCode:~\'s\' OR telephone:~\'s\' OR fax:~\'s\' OR shipToName:~\'s\' OR shipToStreet:~\'s\' OR shipToCity:~\'s\' OR shipToPostalCode:~\'s\'");

                    callback(window.rvFixtures.companiesResp);
                  }, 0);
                }
              };
            },
            updateAddress: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.companiesResp.items[0]);
                  }, 0);
                }
              };
            }
          }
        });
        return deferred.promise;
      };
    });

    $provide.value("CORE_URL", "");
  }));
  
  var companyService;
  
  beforeEach(function() {
    inject(function($injector){
      companyService = $injector.get("companyService");
    });
  });

  it("should exist", function() {
    expect(companyService).be.defined;
  });

  describe("getCompanies", function() {
    it("should get companies", function (done) {
      companyService.getCompanies("some_id", "s").then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp);
        done();
      })
    });
  });

  xdescribe("getSubCompanies", function () {
    it("should load subcompanies", function (done) {
      companyService.getSubCompanies(2, "", "", 20, null).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp);
        done();
      }, function (err) {throw err; });
    });
  });

  describe("getCompany", function() {
    xit("should get company", function (done) {
      throw "Write this";
    });
  });

  describe("deleteCompany", function() {
    xit("should delete company", function (done) {
      throw "Write this";
    });
  });

  xdescribe("updateAddress", function() {
    it("should update address", function (done) {
      companyService.updateAddress(rvFixtures.companiesResp.items[0], false).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp.items[0]);
        done();
      }, function (err) {throw err; });
    });
  });

  describe("validateAddressSimple", function() {
    it("should find errors with an empty address", function () {
      var errors = companyService.validateAddressSimple(
        window.rvFixtures.emptyCompanyAddress);
      expect(errors).to.include("Missing Address (Line 1)");
      expect(errors).to.include("Missing City");
      expect(errors).to.include("Missing Country");
      expect(errors).to.include("Missing State / Province");
      expect(errors).to.include("Missing Zip / Postal Code");
    });
    it("should NOT find errors with a valid address", function () {
      var errors = companyService.validateAddressSimple(window.rvFixtures.validCompanyAddress);
      expect(errors.length).to.equal(0);
    });

  });

});
