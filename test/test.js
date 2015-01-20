var expect = require('expect');


var testcode = require('./sample.json');
var compile = require('../compiler');

var compiled = compile(testcode);


var result = compiled({source: {wert: "hallo"},
                       mappable: [{von: "hier"},
                                  {von: "hier auch"}],

                       colorCodes: [
                           {
                               name: "RED",
                               rgb: "0xff0000"
                           },
                           {
                               name: "BLUE",
                               rgb: "0x0000ff"
                           }
                       ]
                      });
describe('basic tests', function(){
    it('should run all expects', function(done){
        expect(result).toExist();
        
        expect(result.source).toNotExist();
        
        expect(result.target).toExist().toEqual({
            wert: "hallo",
            vendor: "DPA",
            wertclone: { wert: "hallo" }
        });

        expect(result.colors).toExist().toEqual({
            colorRed: {name: "RED", rgb: "0xff0000"},
            colorBlue: {name: "BLUE", rgb: "0x0000ff"}
        });

        
        done();
    });
});


