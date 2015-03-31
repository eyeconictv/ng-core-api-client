describe("Services: Countries Core API Service", function() {
  beforeEach(module("risevision.core.countries"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
        var deferred = Q.defer();
        var gapi = {
          country: {
            list: function () {
              var def = Q.defer();
              
              setTimeout(function () {
                def.resolve({
                  result: {
                    items: []
                  }
                });
              }, 0);
              
              return def.promise;
            }
          }
        };
        deferred.resolve(gapi);
        return deferred.promise;
    });
    $provide.value("CORE_URL", "");
  }));


  var getCoreCountries, COUNTRIES;
  beforeEach(function(){
    inject(function($injector){
      getCoreCountries = $injector.get("getCoreCountries");
      COUNTRIES = $injector.get("COUNTRIES");
    });
  });

  it("should exist",function(){
    expect(getCoreCountries).to.be.truely;
    expect(getCoreCountries).to.be.a.function;
    expect(COUNTRIES).to.be.truely;
    expect(COUNTRIES).to.be.a.function;
  });
  
  describe("getCoreCountries",function(){
    it("should return a promise w/ the countries list",function(done){
      getCoreCountries()
      .then(function(result){
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      })
      .then(null,done);
    });
  });

  describe("COUNTRIES",function(){
    it("should return the list of countries",function(done){
      var result = COUNTRIES;

      setTimeout(function() {
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      }, 10);
    });
  });
});
