/* jshint expr:true */
"use strict";

describe("User Profile: getUserProfile", function() {

  var alfredo = {"username": "Alfredo Sanchez"};

  beforeEach(module("risevision.core.userprofile"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
      var deffered = Q.defer();
      var gapi = {
        user: {
          get: function () {
            return {
              execute: function (callback) {
                setTimeout(function () {
                  callback({result: true, item: angular.copy(alfredo)});
                }, 0);
              }
            };
          }
        }
      };
      deffered.resolve(gapi);
      return deffered.promise;
    });
    $provide.value("oauth2APILoader", function() {
      var deffered = Q.defer();
      deffered.resolve({});
      return deffered.promise;
    });
    $provide.value("CORE_URL", "");
  }));

  it("should exist", function(done) {
    inject(function (getUserProfile) {
      expect(getUserProfile).to.be.ok;
      expect(getUserProfile).to.be.a("function");
      done();
    });
  });

  it("should return user info", function(done) {
    inject(function (getUserProfile) {
      getUserProfile("someusername").then(function (resp) {
        expect(resp).to.deep.equal(alfredo);
        done();
      }, done);
    });
  });

  it("should handle multiple simutaneous calls", function(done) {
    inject(function (getUserProfile, $q) {
      $q.all([getUserProfile("someusername"),
      getUserProfile("someusername1"),
      getUserProfile("someusername2"),
      getUserProfile("someusername3")]).then(function(results){
        expect(results).to.deep.equal([alfredo, alfredo, alfredo, alfredo]);
        done();
      }, done);
    });
  });

});
